import { Outlet, useNavigation } from "react-router-dom"
import { Header } from "../Components/Header";
import { Footer } from "../Components/Footer";

export const AppLayout = () => {
    const navigation = useNavigation();

    if (navigation.state !== "idle") return <p>Loading...</p>
    
    return (
        <>
            <Header />
            <Outlet />
            <Footer/>
        </>
    )
}