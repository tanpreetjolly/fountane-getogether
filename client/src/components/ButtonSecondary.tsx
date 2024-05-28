type Props = {
  text: string
  onClick: () => void
  icon?: any
  prim?: boolean
  fontSize?: string
}

const ButtonSecondary = (props: Props) => {
  return (
    <button
      onClick={props.onClick}
      className={`w-fit  font-medium flex items-center text-base  px-3 rounded-lg gap-2 mb-4 border border-dark text-dark py-1.5 ${props.text === "Invited" ? "bg-green-500 text-black" : "bg-white text-gree"}`}
    >
      <span className={`${props.fontSize ? props.fontSize : ""}`}>
        {props.text}
      </span>
      <span>{props?.icon}</span>
    </button>
  )
}

export default ButtonSecondary
