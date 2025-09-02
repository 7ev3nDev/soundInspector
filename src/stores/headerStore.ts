import { defineStore } from 'pinia'
import { VueElement } from "vue";

export const useHeaderStore = defineStore('header', {
    state: () => {
        return {
            menuContent: {
                component: () => null,
                props: {}
            },
            buttonsContent: {
                component: () => null,
                props: {}
            },
            isMenuOpen: false,
            emits: {}
        }
    },

    actions: {
        setButtonsContent(content: { component: () => VueElement, props?: Record<string, any> }) {
            this.buttonsContent = content
        },

        setMenuContent(content: { component: () => VueElement, props?: Record<string, any> }) {
            this.menuContent = content
        },

        setIsMenuOpen(isOpen: boolean) {
            this.isMenuOpen = isOpen
        },

        toggleMenu() {
            this.isMenuOpen = !this.isMenuOpen
        },

        setEmits(emits: Record<string, Function>) {
            this.emits = emits
        },

        emit(emit: string, ...args: any[]) {
            if (this.emits[emit]) {
                this.emits[emit](...args)
            } else {
                console.warn(`No emit handler for: ${emit}`)
            }
        },

        clear() {
            this.menuContent = {
                component: () => null,
                props: {}
            }
            this.buttonsContent = {
                component: () => null,
                props: {}
            }
            this.isMenuOpen = false
        }
    }
})