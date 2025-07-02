import { defineStore } from 'pinia'
import { ref, onMounted, onBeforeUnmount } from 'vue'

export const useMediaStore = defineStore('media', () => {
    const isMobile = ref(false)
    const isTablet = ref(false)
    const isDesktop = ref(true)

    let mediaMobile: MediaQueryList
    let mediaTablet: MediaQueryList
    let handlerMobile: (e: MediaQueryListEvent) => void
    let handlerTablet: (e: MediaQueryListEvent) => void

    const updateFlags = () => {
        isMobile.value = mediaMobile.matches
        isTablet.value = mediaTablet.matches
        isDesktop.value = !isMobile.value && !isTablet.value
    }

    onMounted(() => {
        mediaMobile = window.matchMedia('(max-width: 600px)')
        mediaTablet = window.matchMedia('(min-width: 601px) and (max-width: 1024px)')

        handlerMobile = (e) => {
            isMobile.value = e.matches
            updateFlags()
        }

        handlerTablet = (e) => {
            isTablet.value = e.matches
            updateFlags()
        }

        mediaMobile.addEventListener('change', handlerMobile)
        mediaTablet.addEventListener('change', handlerTablet)

        updateFlags()
    })

    onBeforeUnmount(() => {
        mediaMobile.removeEventListener('change', handlerMobile)
        mediaTablet.removeEventListener('change', handlerTablet)
    })

    return {
        isMobile,
        isTablet,
        isDesktop
    }
})