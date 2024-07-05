import Image from "next/image"

type Props = {}

const logo = (props: Props) => {
  return (
    <Image height={130} width={130} alt="logo" src={"/logo.png"} />
  )
}

export default logo