import { auth } from "@/auth"
import Navbar from "@/components/navbar/navbar"

const HomeLayout=async({
    children
}: Readonly<{children: React.ReactNode}>)=>{
    //get the authenticated user from server
    const authenticatedUser=await auth()

    return (
        <html lang="en">
            <body>
                <Navbar authenticatedUser={authenticatedUser}/>
                {children}
            </body>
        </html>
    )
}

export default HomeLayout