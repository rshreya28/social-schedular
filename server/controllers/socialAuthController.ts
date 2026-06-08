import {Request,Response } from "express";
import zernio from "../config/zernio.js";
import { User } from "../models/User.js"
import { Account } from "../models/account.js";
import { AuthRequest } from "../middlewares/authMiddleware.js";



// Helper to ensure user has a Zernio profile 
const getOrCreateZernioProfile = async (user:any) : Promise<string> =>
{
   try{
      const result = await zernio.profiles.listProfiles();
      const data = result.data as any;
      const profiles: any[] = Array.isArray(data) ? data : data?.profiles || data?.data ||  [];
 
      if(profiles.length > 0)
      {
         const pid = profiles[0]._id || profiles[0].id
         await User.findByIdAndUpdate(user._id, {zernioProfileId: pid})
         return pid;
      }
      
      const createdData = await zernio.profiles.createProfile({
         body: {name: `${user.name || user.email}'s workspace`} as any,
      })
      const created = (createdData.data as any)?.profile || createdData.data;

      const pid = created?._ || created?.id;

      if(!pid){
         throw new Error("failed to create zernio profile - no Id returned")
      }

      await User.findByIdAndUpdate(user._id, {zernioProfileId: pid})
      return pid || '';
   }
   catch (err){
      console.error('Zernio profile error', err);
      return '';
   }
}

// generate OAuth authorization URL
// GET /api/auth/:platform 

export const generateAuthUrl = async (req: AuthRequest, res: Response): Promise<void> =>
{
 try{
    const {platform} = req.params;
   const profileId = await getOrCreateZernioProfile(req.user);

    const origin = req.headers.origin;
    const redirectUrl ='${origin}/accounts';

    const result = await zernio.connect.getConnectUrl({
      path: {platform: platform as any },
      query: {
         profileId,
         redirect_url: redirectUrl
      }
    })

    const data = result.data as any;
    console.log("getConnectUrl response:", JSON.stringify(data,null,2))

    const authUrl = data.authUrl;
    if(!authUrl){
      throw new Error('zernio returned no authUrl. Full response: ${JSON.stringify(data)}')
    }

    res.json({url: authUrl})


    
 }
 catch (error: any){
    console.error(error);
    res.status(500).json({error: 'Internal Server Error'});
    return;
 }
}

// Sync connected accounts from zernio into MongoDb
//Get /api/auth/sync

export const syncAccounts = async (req: AuthRequest, res: Response): Promise<void> =>
{
   try{
      const profileId = await getOrCreateZernioProfile(req.user);
      const result = await zernio.accounts.listAccounts({
         query: {profileId} as any
      })
 
      const data = result.data as any;
      const zernioAccounts:any[] = data?.accounts || (Array.isArray(data) ? data : []);
      const supportedPlatforms = ["twitter","linkedin","facebook","instagram"];
      const syncedAccounts = [];
      
      for(const zAccount of zernioAccounts){
         const zid = zAccount._id || zAccount.id;
         if(zid){
            console.warn("skipping account with no ID", zAccount);
            continue;
         }

         const rawPlatform = (zAccount.platform || zAccount.type || "").toLowerCase();
         const normalizedPlatform = supportedPlatforms.find((p)=> rawPlatform.includes(p));

         if(!normalizedPlatform)
         {
            console.log('skipping unsupported platform: "${rawPlatform}"');
            continue;
         }
         const account = await Account.findOneAndUpdate(
            { zernioAccountId: zid},
            {
               user: req.user._id,
               platform: normalizedPlatform,
               handle: zAccount.username || zAccount.name || zAccount.handle || "Unknown",
               zernioAccountId: zid,
               status: "connected",
               avatarUrl: zAccount.avatarUrl || zAccount.picture || zAccount.profile_image_url,
            
            },
            {upsert: true, returnDocument: 'after'}
         )
         syncedAccounts.push(account)
      }
res.json(syncedAccounts)
   }
   catch(error: any){
      res.status(500).json({ message: error?.message || "Server error"});

   }
}