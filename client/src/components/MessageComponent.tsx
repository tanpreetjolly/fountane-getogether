const MessageComponent = ({ message, name, date, isUserMessage }: any) => {
  return (
    <div
      className={`flex items-start gap-1 ${isUserMessage ? "flex-row-reverse" : ""}`}
    >
      <div
        className={` h-8 w-8  rounded-xl  flex justify-center  items-center ${isUserMessage ? "bg-indigo-700 text-white" : "bg-slate-300"}`}
      >
        {name.slice(0, 1)}
      </div>
      <div
        className={`flex flex-col w-full max-w-[220px] leading-1.5 py-2 px-4   ${isUserMessage ? "text-right  bg-indigo-600 rounded-ee-2xl rounded-s-2xl text-white" : "  bg-slate-200 text-zinc-700 rounded-e-2xl  rounded-es-2xl"}`}
      >
        <div
          className={`flex items-center gap-2  rtl:space-x-reverse ${isUserMessage ? " flex-row-reverse" : "flex-row"}`}
        >
          <span className="text-sm font-semibold">{name}</span>
          <span className="text-sm font-normal ">{date}</span>
        </div>
        <p className="text-sm font-normal py-2.5  ">{message}</p>
      </div>
    </div>
  )
}

export default MessageComponent
