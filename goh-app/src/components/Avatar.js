import './Avatar.css'
import defAva from '../imgs/default-avatar.png'

export default function Avatar({ src }) {
    let real_src = src === null ? defAva : src;
    return (
        <div className = "avatar">
            <img src={real_src} alt="user avatar" />
        </div>
    )
}