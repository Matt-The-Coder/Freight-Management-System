
const Notfound = () => {

  return (
    <div className="NotFound" style={{
      height: "100vh", display: "flex", alignItems: "center", justifyContent: "center"
    }}>


      <center><h1>404 Not Found!</h1></center>
      <div className="pt-8 text-base font-semibold leading-7">
          <p className="text-gray-900">Want to dig deeper into Tailwind?</p>
          <p>
            <a href="https://tailwindcss.com/docs" className="text-sky-500 hover:text-sky-600">Read the docs &rarr;</a>
          </p>
        </div>
    </div>
  )
}

export default Notfound;