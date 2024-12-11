import jwt from "jsonwebtoken";


const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: "15d",
    });
    res.cookie("jwt", token,{
        httpOnly: true, //This cookie cannot be accessed by the browser
        maxAge: 15 * 24 * 60 * 60 * 1000, //15 days
        sameSite: "strict", //This cookie can only be accessed on the same site
    })
    return token
}
export default generateTokenAndSetCookie