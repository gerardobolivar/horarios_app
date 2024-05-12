export default function MainTitle({innerText = "Test"}){
  const title = innerText;
  return(
    <h1 className="mainTitle">{title}</h1>
  )
}