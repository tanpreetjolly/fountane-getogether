type Props = {
  text: string
  onClick: () => void
  icon?: React.ReactNode
  prim?: boolean
  fontSize?: string
  fullWidth?: boolean
  backgroundColor?: string
}

const ButtonSecondary = (props: Props) => {
  return (
    <button
      onClick={props.onClick}
      className={`${props.fullWidth ? "w-full justify-center" : "w-fit"} ${
        props.backgroundColor
          ? `${props.backgroundColor} hover:bg-opacity-100 bg-opacity-80 `
          : "bg-yellowShade hover:bg-yellow-300 bg-opacity-95 "
      } flex items-center text-sm px-4 rounded-xl gap-2 mb-4 text-dark py-1.5`}
    >
      <span className={`${props.fontSize ? props.fontSize : ""}`}>
        {props.text}
      </span>
      {props.icon}
    </button>
  )
}

export default ButtonSecondary
