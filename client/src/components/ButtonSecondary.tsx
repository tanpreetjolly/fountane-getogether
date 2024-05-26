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
      className="w-fit   flex items-center text-base  px-3 rounded-2xl gap-2 mb-4 bg-slate-700 text-white py-1.5"
    >
      <span className={`${props.fontSize ? props.fontSize : ""}`}>
        {props.text}
      </span>
      <span>{props?.icon}</span>
    </button>
  )
}

export default ButtonSecondary
