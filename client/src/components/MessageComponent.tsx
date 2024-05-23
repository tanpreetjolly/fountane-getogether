const MessageComponent = ({ message, name, date, isUserMessage }: any) => {
  return (
    <div className={`flex items-start  ${isUserMessage ? "justify-end" : ""}`}>
      <div
        className={`flex flex-col w-full max-w-[320px] leading-1.5 py-2 px-4   ${isUserMessage ? "text-right  bg-blue-600 rounded-ee-xl rounded-s-xl" : "bg-gray-700 rounded-e-xl  rounded-es-xl"}`}
      >
        <div
          className={`flex items-center gap-2  rtl:space-x-reverse ${isUserMessage ? " flex-row-reverse" : "flex-row"}`}
        >
          <span className="text-sm font-semibold  text-white">{name}</span>
          <span className="text-sm font-normal  text-gray-300">{date}</span>
        </div>
        <p className="text-sm font-normal py-2.5  text-white">{message}</p>
      </div>
    </div>
  )
}

export default MessageComponent
