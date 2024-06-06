import { useRef, useEffect } from 'react'

function useIsUnmounted () {
    const ref = useRef(false)
    
    useEffect(() => {
        return () => {
            ref.current = true
        }
    }, [ ])
    
    return ref
}

export default useIsUnmounted
