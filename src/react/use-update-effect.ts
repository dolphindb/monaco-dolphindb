import { useRef, useEffect } from 'react'

export function useUpdateEffect (effect, deps) {
    const isMounted = useRef(false)
    
    // for react-refresh
    useEffect(() => {
        return () => {
            isMounted.current = false
        }
    }, [ ])
    
    useEffect(() => {
        if (!isMounted.current) 
            isMounted.current = true
         else 
            return effect()
        
    }, deps)
}
