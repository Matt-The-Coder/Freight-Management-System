import {Outlet} from 'react-router-dom'
const Homelayout = () => 
{
    return(
        <>
        <h1>Header</h1>
        <Outlet/>
        <h1>Footer</h1>
        </>
    )
}

export default Homelayout