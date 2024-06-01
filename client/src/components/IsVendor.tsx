import { SignUpType } from "../definitions"

type Props = {
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  signUpValues: SignUpType
}

const IsVendor = ({ handleChange, signUpValues }: Props) => {
  const handleVendorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange({
      ...e,
      target: {
        ...e.target,
        name: "isVendor",
        value: e.target.id === "vendor" ? "true" : "false",
      },
    })
  }

  return (
    <ul className="grid w-full grid-cols-2 gap-4 text-white text-sm">
      <li>
        <input
          type="radio"
          id="not-vendor"
          name="isVendor"
          value="false"
          className="hidden peer"
          onChange={handleVendorChange}
          checked={signUpValues.isVendor === false}
        />
        <label
          htmlFor="not-vendor"
          className={`inline-flex items-center justify-between w-full p-2 px-4 border text-gray-500 rounded-lg cursor-pointer peer-checked:border-highlight peer-checked:text-highlight ${signUpValues.isVendor === false ? "border-blue-500 bg-blue-50" : "border-gray-500 bg-white"}`}
        >
          <p>
            I am a <span className="font-semibold">Host/Guest</span>{" "}
            organizing/attending an event
          </p>
        </label>
      </li>
      <li className="h-full">
        <input
          type="radio"
          id="vendor"
          name="isVendor"
          value="true"
          className="hidden peer"
          onChange={handleVendorChange}
          checked={signUpValues.isVendor === true}
          required
        />
        <label
          htmlFor="vendor"
          className={`inline-flex h-full items-center justify-between w-full p-2 px-4 border text-gray-500 rounded-lg cursor-pointer peer-checked:border-highlight peer-checked:text-highlight ${signUpValues.isVendor === true ? "border-blue-500 bg-blue-50" : "border-gray-500 bg-white"}`}
        >
          <p>
            I am a <span className="font-semibold">Vendor</span> providing
            services
          </p>
        </label>
      </li>
    </ul>
  )
}

export default IsVendor
