import { useEffect, useState } from "react";
import { dummyPostsData, PLATFORMS } from "../assets/assets";
import { XIcon, UploadIcon, ArrowRightIcon, CalendarDaysIcon, CheckCircleIcon } from "lucide-react";

const Scheduler = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchPosts = async () => {
    setPosts(dummyPostsData);
  };

  useEffect(() => {
    fetchPosts();

    const interval = setInterval(() => {
      fetchPosts();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const scheduled = posts.filter(
    (p) => p.status === "scheduled"
  );

  const published = posts.filter(
    (p) => p.status === "published"
  );

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId)
        ? prev.filter((id) => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setPosts((prev) => [...prev, dummyPostsData[0]]);
    }, 1000);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Compose Panel */}
      <div className="w-full lg:w-[460px] shrink-0">
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-lg text-slate-700 font-semibold">
              Compose Post
            </h2>
          </div>

          <form className="space-y-4" onSubmit={handleSchedule}>
            {/* Platforms */}
            <div>
              <label className="block text-sm font-medium uppercase text-slate-700 mb-2">
                Platforms
              </label>

              <div className="flex flex-wrap gap-3">
                {PLATFORMS.map((p) => {
                  const active = selectedPlatforms.includes(p.id);

                  return (
                    <button key={p.id} type="button"  onClick={() => togglePlatform(p.id)
                      }
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                        active
                          ? "bg-red-50 text-red-600 scale-105 "
                          : "border-slate-200 text-slate-700  hover:border-slate-300"
                      }`} >
                      <p.icon className="size-4" />
                      <span>{p.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Content
              </label>

              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                placeholder="What do you want to share today?"
                className="w-full px-5 py-4 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-500 outline-none resize-none"
              />
              <div className={`text-sm text-slate-500 mt-2 font-medium ${content.length > 270 ? "text-red-500" : "text-slate-400"}`}> {content.length}/280 characters
              </div>
            </div>

            {/* Media Upload */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Media(optional)
              </label>
              {mediaFile ? ( 
                <div className="relative rounded-xl 
                 gap-3 overflow-hidden border border-slate-200 bg-slate-50 ">
                  {mediaFile.type.startsWith("image/") ? 
                  <img src={URL.createObjectURL(mediaFile)} alt="Preview" className="w-full h-48 object-cover" /> : 
                  <video src={URL.createObjectURL(mediaFile)}  className="w-full h-40 object-cover" controls />
                    }
                    <button type="button" onClick={() => setMediaFile(null)} className="absolute top-2 right-2 bg-white rounded-full p-1 hover:bg-slate-100">
                      <XIcon className="size-3.5"/>
                      </button>
                      </div>
              ) : (
                <label className="flex items-center gap-2 p-5 py-10 rounded-xl border-2 border-dashed border-slate-200 text-slate-700 hover:border-red-300 hover:bg-red-50/30  transition-all group justify-center cursor-pointer">
                      <UploadIcon className="size-4" />
                      <span className="text-sm font-medium text-slate-500 group-hover-red:text-ed-600 transition-colors">
                        Upload Media
                      </span>
                      <input type="file" accept="image/*,video/*" className="hidden" onChange={(e) => {
                        if(e.target.files && e.target.files?.[0]){
                          setMediaFile(e.target.files[0]);
                        } }} />
                    </label>
              )}
            </div>

            {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  {/* Date */}
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-2">
      Schedule Date
    </label>

    <input
      type="date"
      value={scheduledDate.split("T")[0] || ""}
      onChange={(e) => {
        const time = scheduledDate.split("T")[1] || "";
        setScheduledDate(`${e.target.value}T${time}`);
      }}
      className="w-full border border-slate-300 rounded-lg p-3 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-red-500"
    />
  </div>

  {/* Time */}
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-2">
      Schedule Time
    </label>

    <input
      type="time"
      value={scheduledDate.split("T")[1] || ""}
      onChange={(e) => {
        const date = scheduledDate.split("T")[0] || "";
        setScheduledDate(`${date}T${e.target.value}`);
      }}
      className="w-full border border-slate-300 rounded-lg p-3 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-red-500"
    />
  </div>
</div>

            {/* Submit */}
        <button
  type="submit"
  disabled={loading}
  className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
>
  {loading ? (
    <>
      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      <span>Scheduling...</span>
    </>
  ) : (
    <>
      <span>Schedule Post</span>
      <ArrowRightIcon className="size-4" />
    </>
  )}
</button>
          </form>
        </div>
      </div> 
{/* Queue Panels */}
<div className="flex-1 flex flex-col gap-6 min-w-0">

  {/* Upcoming Posts */}
  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
    <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100">
      <CalendarDaysIcon className="size-5 text-slate-600" />

      <h3 className="text-lg font-semibold text-slate-700">
        Upcoming
      </h3>

      <span className="ml-auto text-xs font-medium bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded-full">
        {scheduled.length}
      </span>
    </div>

    <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
      {scheduled.length === 0 ? (
        <div className="py-10 text-center text-slate-400 text-sm">
          No posts scheduled. Your scheduled posts will appear here.
        </div>
      ) : (
        scheduled.map((post) => (
          <div
            key={post._id}
            className="px-5 py-4 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3 mb-2 flex-wrap">

              {/* Platform Icons */}
              <div className="flex items-center gap-1.5">
                {post.platforms.map((pl: string) => {
                  const meta = PLATFORMS.find(
                    (p) => p.id === pl
                  );

                  return meta ? (
                    <meta.icon
                      key={pl}
                      className="size-4 text-slate-500"
                    />
                  ) : null;
                })}
              </div>

              {/* Media Type */}
              {post.mediaType && (
                <span className="text-xs capitalize font-medium bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded-full">
                  {post.mediaType}
                </span>
              )}

              {/* Date */}
<span className="text-xs text-slate-500">
  {post.scheduledFor
    ? new Date(post.scheduledFor).toLocaleString()
    : "No Date"}
</span>
            </div>

            <p className="text-slate-700 text-sm line-clamp-2">
              {post.content}
            </p>
          </div>
        ))
      )}
    </div>
  </div>

  {/* Published Posts */}
  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
    <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100">
      <CheckCircleIcon className="size-5 text-green-600" />

      <h3 className="text-lg font-semibold text-slate-700">
        Published
      </h3>

      <span className="ml-auto text-xs font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
        {published.length}
      </span>
    </div>

    <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
      {published.length === 0 ? (
        <div className="py-10 text-center text-slate-400 text-sm">
          No published posts yet.
        </div>
      ) : (
        published.map((post) => (
          <div
            key={post._id}
            className="px-5 py-4 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3 mb-2 flex-wrap">

              {/* Platform Icons */}
              <div className="flex items-center gap-1.5">
                {post.platforms.map((pl: string) => {
                  const meta = PLATFORMS.find(
                    (p) => p.id === pl
                  );

                  return meta ? (
                    <meta.icon
                      key={pl}
                      className="size-4 text-slate-500"
                    />
                  ) : null;
                })}
              </div>

              {/* Media Type */}
              {post.mediaType && (
                <span className="text-xs capitalize font-medium bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded-full">
                  {post.mediaType}
                </span>
              )}

              {/* Date */}
            
<span className="text-xs text-slate-500">
  {post.status === "published"
    ? new Date(post.updatedAt).toLocaleString()
    : new Date(post.scheduledFor).toLocaleString()}
</span>
            </div>

            <p className="text-slate-700 text-sm line-clamp-2">
              {post.content}
            </p>
          </div>
        ))
      )}
    </div>
  </div>

</div>



      </div>
    
  );
}
export default Scheduler;