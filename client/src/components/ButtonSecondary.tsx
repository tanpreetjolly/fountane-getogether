type Props = {
  text: string
  onClick: () => void
  icon?: any
  prim?: boolean
}

const ButtonSecondary = (props: Props) => {
  return (
    <button
      onClick={props.onClick}
      className="w-fit   flex items-center text-base  px-4 rounded-lg gap-2 mb-4 bg-dark text-white py-1.5"
    >
      <span>{props.text}</span>
      <span>{props?.icon}</span>
    </button>
  )
}

export default ButtonSecondary
