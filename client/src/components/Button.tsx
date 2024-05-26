type Props = {
  disabled?: boolean
  text: string
  onClick: () => void
  icon?: any
  prim?: boolean
}

const Button = (props: Props) => {
  return (
    <button
      disabled={props.disabled}
      onClick={props.onClick}
      className="flex items-center gap-2 justify-center w-full max-w-lg bg-dark text-white py-3 text-lg rounded-lg"
    >
      <span>{props?.icon}</span>
      <span>{props.text}</span>
    </button>
  )
}

export default Button
