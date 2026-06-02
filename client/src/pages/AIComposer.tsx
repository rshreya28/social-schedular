// React import not required with the new JSX transform

import { ArrowRightIcon, HistoryIcon, Loader2Icon, Wand2Icon, XIcon, CalendarIcon, ClockIcon, Globe, Hash, Camera, Briefcase, TimerIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { dummyGenerationData } from "../assets/assets";

type Platform = { id: string; name: string; icon: any };
const PLATFORMS: Platform[] = [
  { id: "facebook", name: "Facebook", icon: Globe },
  { id: "twitter", name: "Twitter", icon: Hash },
  { id: "instagram", name: "Instagram", icon: Camera },
  { id: "linkedin", name: "LinkedIn", icon: Briefcase },
];

const AIComposer = () => {
  const [promt, setPromt] = useState<string>("");
  const [tone, setTone] = useState<string>("Professional");
  const [generateImage, setGenerateImage] = useState(true);
  const [loading, setLoading] = useState(false);
  const [generations, setGenerations] = useState<any[]>([]);

  // Scheduling state
  const [activeScheduler, setActiveScheduler] = useState<any | null>(null);
  const [selectedplatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [scheduledDate, setScheduledDate] = useState<string>("");
  const [scheduledTime, setScheduledTime] = useState<string>("");
  const [scheduling, setScheduling] = useState(false);

  const tones = [
    "Professional",
    "Creative",
    "Funny",
    "Minimalistic",
    "Excited",
  ];
 const handleSchedule = async () => {
  try {
    setScheduling(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    setActiveScheduler(null);
  } catch (error) {
    console.error(error);
  } finally {
    setScheduling(false);
  }
};





  const fetchGenerations = async () => {
    setGenerations(dummyGenerationData);
  };

  useEffect(() => {
    fetchGenerations();
  }, []);

  const handleGenerate = async () => {
    try {
      setLoading(true);



      // Your API call here
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 animate-in fade-in duration-700">
      {/* Input Section */}
      <div className="space-y-6 text-center mt-20">
        <h1 className="text-3xl font-semibold text-slate-700 tracking-tight">
          What should I create today?
        </h1>

        <div className="relative mt-12">
          <textarea
            className="w-full h-40 px-6 py-6 bg-white border border-gray-200 rounded-2xl text-slate-900 placeholder-slate-400 resize-none outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent shadow-sm"
            placeholder="Share your idea here..."
            value={promt}
            onChange={(e) => setPromt(e.target.value)}
          />

          {/* Bottom Controls */}
          <div className="absolute bottom-4 left-4 flex items-center gap-3">
            <span className="text-sm font-medium text-gray-600">
              AI Image
            </span>

            <button
              type="button"
              onClick={() => setGenerateImage(!generateImage)}
              className={`relative inline-flex h-7 w-14 items-center rounded-full transition-all duration-300 ${
                generateImage ? "bg-red-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
                  generateImage ? "translate-x-8" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Generate Button */}
          <div className="absolute bottom-4 right-4">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="bg-red-500 hover:bg-red-600 hover:scale-105 hover:shadow-xl active:scale-95 text-white flex items-center gap-2 px-5 py-2.5 rounded-xl shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2Icon className="size-4 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <span>Generate</span>
                  <ArrowRightIcon className="size-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tone Selection */}
        <div className="flex flex-wrap justify-center gap-3">
          {tones.map((item) => (
            <button
              key={item}
              onClick={() => setTone(item)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                tone === item
                  ? "bg-red-500 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-red-300 hover:text-red-500"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* AI Generated Posts Section */}
      <div className="space-y-6 pt-12 border-slate-100 border-t">
        <div className=" flex items-center justify-between text-slate-600">
        <div className="flex items-center gap-2">
          <HistoryIcon className="size-5" />
          <h2 className="text-xl">Recent Generations</h2>
        </div>
        <span className="text-sm text-slate-500 bg-slate-50 px-2">{generations.length} total</span>
      </div>


      <div className=" grid grid-cols-1 md:grid-cols xl:grid-cols-3 gap-6">
        {generations.map((gen)=> (
          <div key={gen._id } className="group bg-white rounded-2xl border
          border-slate-100 p-5 hover:border-red-200 transition-all relative overflow-hidden ">
            <div className="flex flex-col h-full space-y-4">
              <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 uppercase tracking-widest ">{new Date(gen.createdAt).toLocaleString()}</span>
              <span className="text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded-md"> {gen.tone}</span>
</div>

<p className="text-sm text-slate-600 line-clamp-3 leading-relaxed flex-1"> { gen.content} </p>

{gen.mediaUrl && ( 
  <div className=" rounded-xl overflow-hidden border border-slate-50
  bg-slate-50">
    <img src={ gen.mediaUrl} alt="gen" className="w-full aspect-video object-cover
     opacity-90 group-hover:opacity-100 transition-opacity"/>
  </div>
)}

<div className=" flex items-center gap-2 pt-2">
  <button onClick={()=> setActiveScheduler(gen) }
    className="flex-1 bg-slate-100 hover:bg-red-500 hover:text-white 
    text-slate-600 text-xs py-2.5 rounded-lg transition-all"
  >
    scheduled post
  </button>
</div>

            </div>
          </div>
        ))}


        {
          generations.length === 0 && (
            <div className=" col-span-full py-20 text-center space-y-2">
              <div className=" size-12 bg-slate-50 rounded-2xl flex items-center 
              justify-center mx-auto text-slate-300">
                <Wand2Icon className="size-6"/>
              </div>
              <p className="text-slate-400 text-sm"> No content generated yet. Try generating some content using AI </p>
            </div>
          )
        }

      </div>
</div>
      {/* Scheduler Modal */}
      {activeScheduler && (
        <div className=" fixed inset-0 min-hscreen z-50 flex items-center justify-center p-4
         bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className=" bg-white rounded-xl shadow-2xl w-full max-w-2xl border
          border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">

            <div className=" flex items-center justify-between px-8 py-4
            border-b border-slate-100 bg-slate-50/30 ">
              <h3 className="text-slate-900" > schedule generation </h3> 
              <button onClick={()=> setActiveScheduler(null)} className="p-2 rounded-full hover:bg-slate-100
              text-slate-400 transition-colors"> 
                <XIcon className="size-5"/>
              </button>
              </div>
<div className="flex-1 overflow-y-auto p-8 space-y-4">
<div className=" bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-4">
  <p className="text-slate-800 text-sm leading-releaxed whitespace-pre-wrap">
    {activeScheduler.prompt}
    </p> 
   
</div>
</div>

<div className="flex-1 overflow-y-auto p-8 space-y-4">
<div className=" bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-4">
  <p className="text-slate-800 text-sm leading-releaxed whitespace-pre-wrap">
    {activeScheduler.content}
    </p> 
    
{activeScheduler.mediaUrl && <img src={activeScheduler.mediaUrl} alt="preview" 
className="w-full aspect-video object-cover rounded-xl border 
border-slate-200 shadow-sm"/>}

</div>
</div>

<div className="p-8 bg-slae-50/50 border-t border-slate-50 space-y-8">
{/*options*/}
<div className="space=y-6">
  <div>
    <label className=" block text-xs text-slate-600 uppercase tracking-wideset
    mb-4"> select channel </label>
    <div className=" flex flex-wrap gap-2">
{PLATFORMS.map((p: Platform) => {
  const active = selectedplatforms.includes(p.id);
  const Icon = p.icon;
  return (
    <button
      key={p.id}
      onClick={() =>
        setSelectedPlatforms((prev) =>
          prev.includes(p.id) ? prev.filter((id) => id !== p.id) : [...prev, p.id]
        )
      }
      className={`px-3 py-2 rounded-md flex items-center gap-2 text-sm border transition-colors ${
        active ? "bg-red-500 text-white" : "bg-white text-slate-600 border-slate-200"
      }`}
    >
      <Icon className="size-4.5  transition-transform duration-300 group-hover:rotate-12" />
      <span>{p.name}</span>
    </button>
  );
})}
    </div>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

    <div className="relative ">
      <CalendarIcon className=" size-4 absolute left-4 top-1/2 -translate-y-1/2
      text-slate-400"/>
      <input type="date" className="w-full pl-11 pr-4 py-3 bg-slate-50 border
      border-slate-100 rounded-md text-slate-900 text-sm focus:outline-none
      transition-all" value={scheduledDate} onChange={(e)=>setScheduledDate
        (e.target.value)
      } />
  
      </div>




      <div className="relative ">
      <ClockIcon className=" size-4 absolute left-4 top-1/2 -translate-y-1/2
      text-slate-400"/>
      <input type="time" className="w-full pl-11 pr-4 py-3 bg-slate-50 border
      border-slate-100 rounded-md text-slate-900 text-sm focus:outline-none
      transition-all" value={scheduledTime} onChange={(e)=>setScheduledTime
        (e.target.value)
      } />
  
      </div>

  </div>
</div>
<button onClick={handleSchedule} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
  {scheduling ? (
    <Loader2Icon className="size-4 animate-spin" />
  ) : (
    <TimerIcon className="size-4" />
  )} Schedule post
</button>



</div>

            </div> 

        </div>
      )}
    </div>
  );
};

export default AIComposer;