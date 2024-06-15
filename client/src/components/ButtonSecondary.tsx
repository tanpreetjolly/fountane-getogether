type Props = {
  text: string
  onClick: () => void
  icon?: any
  prim?: boolean
  fontSize?: string
  fullWidth?: boolean
}

const ButtonSecondary = (props: Props) => {
  return (
    <button
      onClick={props.onClick}
      className={`${props.fullWidth ? "w-full justify-center" : "w-fit"}  bg-yellowShade bg-opacity-85 hover:bg-yellow-400  flex items-center text-sm  px-4 rounded-xl gap-2 mb-4  text-dark py-1.5`}
    >
      <span className={`${props.fontSize ? props.fontSize : ""}`}>
        {props.text}
      </span>
      <span>{props?.icon}</span>
    </button>
  )
}

export default ButtonSecondary
