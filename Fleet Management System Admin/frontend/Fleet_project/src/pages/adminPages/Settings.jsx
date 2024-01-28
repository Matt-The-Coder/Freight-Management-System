import { useOutletContext, useNavigate, Form } from 'react-router-dom'
import '/public/assets/css/adminLayout/settings.css'
import axios from 'axios'
import bcrypt from 'bcryptjs'
import { useEffect, useRef, useState } from 'react'
const Settings = () => {
    const hostServer = import.meta.env.VITE_SERVER_HOST
    const uploadingServer = import.meta.env.VITE_UPLOADING_SERVER
    const { u_id, setIsLoading,image, setImage } = useOutletContext()
    const [fName, setFName] = useState("")
    const [lName, setLName] = useState("")
    const [uName, setUName] = useState("")
    const [email, setEmail] = useState("")
    const [role, setRole] = useState('')
    const [uPassword, setUPassword] = useState("")
    const [cP, setCP] = useState("")
    const [nP, setNP] = useState('')
    const [cNP, setCNP] = useState('')
    const [refresh, setRefresh] = useState(false)
    const [oldPasswordError, setOldPasswordError] = useState(false)
    const [mismatchedPassword, setMismatchedPassword] = useState(false)
    const [usernameError, setUsernameError] = useState(false)
    const profilePic = useRef(null)
    const nav = useNavigate()
        useEffect(()=>{
            const getInfo = async () => {
                try {
                    setIsLoading(true)
                    const result = await axios.get(`${hostServer}/getaccountbyid/${u_id}`)
                    if (result.data.message) {
                        // nav("/login")
                    } else {
                        const userData = result.data
                        setFName(userData[0].u_first_name)
                        setLName(userData[0].u_last_name)
                        setEmail(userData[0].u_email)
                        setUName(userData[0].u_username)
                        setUPassword(userData[0].u_password)
                        setRole(userData[0].u_role)
                    }
                    setIsLoading(false)
                } catch (error) {
                    console.log(error)
                }
            }
            getInfo()
        }, [refresh])
    

    const updateInformation = async (e) => {
        e.preventDefault()
        try {
            const result = await axios.post(`${hostServer}/updatePersonalInfo`, {
                fName, lName, uName, email, u_id
            })
            const data = result.data
            if(data.errorMessage){
                setUsernameError(true)
                setTimeout(()=>{setUsernameError(false)}, 2000)
            }else{
                setRefresh(!refresh)
                alert("Updated Successfully!")
            }

        } catch (error) {
            console.log(error)
        }


    }
    const updateSecurity = async (e) => {
        e.preventDefault()
        try {
            const isMatched = await bcrypt.compare(cP, uPassword)
            if(isMatched)
            {
                if(nP == cNP){

            const result = await axios.post(`${hostServer}/updateSecurityInfo`,
            {
                nP, u_id
            })
            const data = result.data
            alert(data.message)
                }else
                {
                    setMismatchedPassword(true)
                    setTimeout(()=>{setMismatchedPassword(false)}, 2000)
                    console.log("new password does not match")
                }
            }
            else 
            {
                setOldPasswordError(true)
                setTimeout(()=>{setOldPasswordError(false)}, 2000)
                console.log("Old password is wrong")
            }
        } catch (error) {
            console.log(error)
        }
        
    }
    const changePicture = () => 
    {
        const pic = profilePic.current
        const img = document.getElementById("prof-pic")
        pic.click()
        pic.addEventListener("change", async (e) => 
        {
            const result = e.target.files[0]
            const formData = new FormData()
            formData.append('my_file', result)
            try {
                setIsLoading(true)
                const upload = await axios.post(`${hostServer}/upload/${u_id}`, formData)
                // img.src = URL.createObjectURL(result)
                if(upload.data){
                   const uploadedImage = await axios.get(`${hostServer}/getProfilePicture/${u_id}`)
                   console.log(uploadedImage.data)
                   const fileImage = uploadedImage.data.image[0].u_profile_picture
                   setImage(fileImage)
                } else {
                    console.log("Uploading failed.")
                }
                setIsLoading(false)
            } catch (error) {
                console.log(error)
            }

        })
    }
    return (
        <div className="Settings">
            <div className="adminHeader">
                <div className="left">
                    <h1>Account settings</h1>
                    <ul className="breadcrumb">
                        <li><a href="#">
                            User Access
                        </a></li>
                        /
                        <li><a href="#" className="active">Account Info</a></li>
                    </ul>
                </div>
            </div>
            <div className="settings-container">
                <div className="personal-settings">
                    <div className="title">
                        <h3>Personal Information</h3>
                    </div>
                    <div className="profile">
                        <img src={`${uploadingServer}/${image}`} alt="Profile" id="prof-pic"/>
                        <input type="file" name="prof-pic"  ref={profilePic} hidden/>
                        <i className='bx bx-camera'  onClick={changePicture}  ></i>
                        <div className="sub-title">
                            <h4>{fName} <span>{lName}</span></h4>
                            <h5>{role}</h5>
                        </div>
                    </div>
                    <form onSubmit={(e) => { updateInformation(e) }}>
                        <div className="first-row">
                            <div className="first-column">
                                <label htmlFor="name">First Name</label>
                                <input type="text" placeholder='First Name' value={fName} onChange={(e) => { setFName(e.target.value) }} required/>
                            </div>
                            <div className="second-column">
                                <label htmlFor="name">Last Name</label>
                                <input type="text" placeholder='Last Name' value={lName} onChange={(e) => { setLName(e.target.value) }} required/>
                            </div>
                        </div>
                        {usernameError && <div className="password-error">
                        <p>Username already exists!</p>
                        </div>}
                        <div className="second-row">
                            <div className="first-column">
                                <label htmlFor="name">Username</label>
                                <input type="text" placeholder='Username' value={uName} onChange={(e) => { setUName(e.target.value) }} required/>
                            </div>
                            <div className="second-column">
                                <label htmlFor="name">Email</label>
                                <input type="emai;" placeholder='Email' value={email} onChange={(e) => { setEmail(e.target.value) }} required/>
                            </div>
                        </div>

                        <div className="save-button">
                            <button type='submit'>Save <span>Profile</span> </button>
                        </div>
                    </form>
                </div>
                <div className="security-settings">
                    <div className="title">
                        <h3>Security Information</h3>
                    </div>
                    <form onSubmit={(e)=>{updateSecurity(e)}}>
                        <div className="first-row">
                            <div className="first-column">
                                <label htmlFor="name">Current Password</label>
                                <input type="password" placeholder='Password' onChange={(e) => { setCP(e.target.value) }}  required/>
                            </div>
                        </div>
                        {oldPasswordError && <div className="password-error">
                        <p>Old Password is Wrong!</p>
                        </div>}
                        <div className="second-row">
                            <div className="first-column">
                                <label htmlFor="name">New Password</label>
                                <input type="password" placeholder='New Password' onChange={(e) => { setNP(e.target.value) }} pattern='(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}' title='Must contain at least one  number and one uppercase and lowercase letter, and at least 8 or more characters"' required/>
                            </div>
                            <div className="second-column">
                                <label htmlFor="name">Confirm Password</label>
                                <input type="password" placeholder='Re-enter new password' onChange={(e) => { setCNP(e.target.value) }} pattern='(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}' title='Must contain at least one  number and one uppercase and lowercase letter, and at least 8 or more characters"' required/>
                            </div>
                        </div>
                        {mismatchedPassword &&  <div className="password-error">
                                <p>Please make sure your passwords match.</p>
                            </div>}
 
                        <div className="save-button">
                            <button type='submit'>Save <span>Password</span> </button>
                        </div>
                    </form>
                </div>
            </div>



        </div>
    )
}

export default Settings;