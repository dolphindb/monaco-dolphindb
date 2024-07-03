import { useRef, useEffect } from 'react'

function use_is_unmounted () {
    const ref = useRef(false)
    
    useEffect(() => {
        return () => {
            ref.current = true
        }
    }, [ ])
    
    return ref
}

export default use_is_unmounted
