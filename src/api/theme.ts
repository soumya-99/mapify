import "../utils/material-theme-control"
import { highLightPath } from "./algorithm"

const floatingActionButton = document.querySelector(".fixed-action-btn") as HTMLDivElement
const floatingButton = document.getElementById("floating-action") as HTMLAnchorElement

const materialBlueBtn = document.getElementById("m-blue") as HTMLAnchorElement
const materialYellowBtn = document.getElementById("m-yellow") as HTMLAnchorElement
const materialRedBtn = document.getElementById("m-red") as HTMLAnchorElement
const materialGreenBtn = document.getElementById("m-green") as HTMLAnchorElement
const materialPurpleBtn = document.getElementById("m-purple") as HTMLAnchorElement
const materialTealBtn = document.getElementById("m-teal") as HTMLAnchorElement
const materialColorfulBtn = document.getElementById("m-colorful") as HTMLAnchorElement

const srcButton = document.getElementById("source") as HTMLAnchorElement
const destButton = document.getElementById("dest") as HTMLAnchorElement
const showPathButton = document.getElementById("sp") as HTMLAnchorElement
const resetButton = document.getElementById("reset") as HTMLAnchorElement
const help = document.getElementById("help") as HTMLAnchorElement
const zoomButton = document.getElementById("zoom") as HTMLAnchorElement
const fullScreenButton = document.getElementById("fullscreen") as HTMLAnchorElement
const downloadButton = document.getElementById("download") as HTMLAnchorElement

const COLORS: string[] = [
    "red",
    "green",
    "blue",
    "orange",
    "purple",
    "pink",
    "cyan",
    "indigo",
    "teal",
    "amber",
]
const NAV_BUTTONS: HTMLAnchorElement[] = [
    srcButton,
    destButton,
    showPathButton,
    resetButton,
    help,
    fullScreenButton,
    zoomButton,
    downloadButton,
]

const navBar = document.getElementsByTagName("nav")[0] as HTMLDivElement
const footer = document.getElementsByTagName("footer")[0] as HTMLDivElement

const fbButton = document.getElementById("link-fb") as HTMLButtonElement
const githubButton = document.getElementById("link-github") as HTMLButtonElement
const twitterButton = document.getElementById("link-twitter") as HTMLButtonElement
const instaButton = document.getElementById("link-insta") as HTMLButtonElement

// added in Social Icons for ease of access
const mapUploadButton = document.getElementById("map-upload-button") as HTMLAnchorElement

const SOCIAL_BUTTONS = [
    fbButton,
    githubButton,
    twitterButton,
    instaButton,
    mapUploadButton,
]

const card1 = document.getElementById("card-1") as HTMLDivElement
const card2 = document.getElementById("card-2") as HTMLDivElement
const card3 = document.getElementById("card-3") as HTMLDivElement
const card4 = document.getElementById("card-4") as HTMLDivElement

const CARDS = [card1, card2, card3, card4]

const srcIcon = document.getElementById("src-icon") as HTMLElement
const destIcon = document.getElementById("dest-icon") as HTMLElement
const spIcon = document.getElementById("sp-icon") as HTMLElement
const resetIcon = document.getElementById("reset-icon") as HTMLElement
const helpIcon = document.getElementById("help-icon") as HTMLElement
const zoomIcon = document.getElementById("zoom-icon") as HTMLElement
const fullscreenIcon = document.getElementById("fullscreen-icon") as HTMLElement
const downloadIcon = document.getElementById("download-icon") as HTMLElement

const ICONS = [
    srcIcon,
    destIcon,
    spIcon,
    resetIcon,
    helpIcon,
    fullscreenIcon,
    zoomIcon,
    downloadIcon,
]

let materialYouPathColor = "ff0000"
const whiteTexts = document.querySelectorAll(".white-text")

const materialColorful = () => {
    localStorage.setItem("theme", "0")
    let isChecked = (document.getElementById("switch-dark") as HTMLInputElement).checked as any
    localStorage.setItem("dark", isChecked)
    if (isChecked) {
        navBar.style.backgroundColor = "rgba(55, 71, 79, 0.6)"
        document.body.style.background = "rgb(51, 68, 85)"
        document.body.style.color = "rgb(216, 237, 255)"

        whiteTexts.forEach((text) => {
            text.removeAttribute("style")
        })

        COLORS.forEach((color) => {
            for (let i = 0; i < NAV_BUTTONS.length; i++) {
                if (
                    NAV_BUTTONS[i].classList.contains(color) ||
                    NAV_BUTTONS[i].classList.contains("lighten-5") ||
                    NAV_BUTTONS[i].classList.contains("darken-4")
                ) {
                    NAV_BUTTONS[i].classList.remove(color)
                    NAV_BUTTONS[i].classList.remove("lighten-5")
                    NAV_BUTTONS[i].classList.remove("darken-4")
                }
                NAV_BUTTONS[i].removeAttribute("style")
                NAV_BUTTONS[0].classList.add("blue")
                NAV_BUTTONS[1].classList.add("green")
                NAV_BUTTONS[2].classList.add("red")
                NAV_BUTTONS[3].classList.add("orange")
                NAV_BUTTONS[4].classList.add("pink")
                NAV_BUTTONS[5].classList.add("amber")
                NAV_BUTTONS[6].classList.add("purple")
                NAV_BUTTONS[7].classList.add("indigo")
            }

            ICONS.forEach((icon) => {
                icon.removeAttribute("style")
            })

            if (footer.classList.contains(color)) {
                footer.classList.remove(color)
            }
            footer.removeAttribute("style")
            footer.classList.add("blue")

            for (let i = 0; i < SOCIAL_BUTTONS.length; i++) {
                if (
                    SOCIAL_BUTTONS[i].classList.contains(color) ||
                    SOCIAL_BUTTONS[i].classList.contains("lighten-5") ||
                    SOCIAL_BUTTONS[i].classList.contains("darken-4")
                ) {
                    SOCIAL_BUTTONS[i].classList.remove(color)
                    SOCIAL_BUTTONS[i].classList.remove("lighten-5")
                    SOCIAL_BUTTONS[i].classList.remove("darken-4")
                    SOCIAL_BUTTONS[i].removeAttribute("style")
                    SOCIAL_BUTTONS[i].style.color = "white"
                }
                SOCIAL_BUTTONS[i].removeAttribute("style")
                SOCIAL_BUTTONS[0].classList.add("blue")
                SOCIAL_BUTTONS[1].classList.add("red")
                SOCIAL_BUTTONS[2].classList.add("green")
                SOCIAL_BUTTONS[3].classList.add("orange")
            }

            for (let i = 0; i < CARDS.length; i++) {
                if (CARDS[i].classList.contains(color)) {
                    CARDS[i].classList.remove(color)
                    CARDS[i].removeAttribute("style")
                }
                CARDS[i].classList.add("white-text")
                CARDS[0].classList.add("blue", "darken-2")
                CARDS[1].classList.add("red", "darken-2")
                CARDS[2].classList.add("green", "darken-2")
                CARDS[3].classList.add("orange", "darken-2")
            }
        })
    } else {
        navBar.style.backgroundColor = "rgba(55, 71, 79, 0.6)"
        document.body.style.backgroundImage =
            "linear-gradient(to left, rgb(216, 237, 255), #90a4ae)"

        whiteTexts.forEach((text) => {
            text.removeAttribute("style")
        })

        COLORS.forEach((color) => {
            for (let i = 0; i < NAV_BUTTONS.length; i++) {
                if (
                    NAV_BUTTONS[i].classList.contains(color) ||
                    NAV_BUTTONS[i].classList.contains("lighten-5") ||
                    NAV_BUTTONS[i].classList.contains("darken-4")
                ) {
                    NAV_BUTTONS[i].classList.remove(color)
                    NAV_BUTTONS[i].classList.remove("lighten-5")
                    NAV_BUTTONS[i].classList.remove("darken-4")
                }
                NAV_BUTTONS[i].removeAttribute("style")
                NAV_BUTTONS[0].classList.add("blue")
                NAV_BUTTONS[1].classList.add("green")
                NAV_BUTTONS[2].classList.add("red")
                NAV_BUTTONS[3].classList.add("purple")
                NAV_BUTTONS[4].classList.add("indigo")
                NAV_BUTTONS[5].classList.add("orange")
                NAV_BUTTONS[6].classList.add("amber")
                NAV_BUTTONS[7].classList.add("pink")
            }

            ICONS.forEach((icon) => {
                icon.removeAttribute("style")
            })

            if (footer.classList.contains(color)) {
                footer.classList.remove(color)
            }
            footer.removeAttribute("style")
            footer.classList.add("blue")

            for (let i = 0; i < SOCIAL_BUTTONS.length; i++) {
                if (
                    SOCIAL_BUTTONS[i].classList.contains(color) ||
                    SOCIAL_BUTTONS[i].classList.contains("lighten-5") ||
                    SOCIAL_BUTTONS[i].classList.contains("darken-4")
                ) {
                    SOCIAL_BUTTONS[i].classList.remove(color)
                    SOCIAL_BUTTONS[i].classList.remove("lighten-5")
                    SOCIAL_BUTTONS[i].classList.remove("darken-4")
                    SOCIAL_BUTTONS[i].style.color = "white"
                }
                SOCIAL_BUTTONS[i].removeAttribute("style")
                SOCIAL_BUTTONS[0].classList.add("blue")
                SOCIAL_BUTTONS[1].classList.add("red")
                SOCIAL_BUTTONS[2].classList.add("green")
                SOCIAL_BUTTONS[3].classList.add("orange")
            }

            for (let i = 0; i < CARDS.length; i++) {
                if (CARDS[i].classList.contains(color)) {
                    CARDS[i].classList.remove(color)
                    CARDS[i].removeAttribute("style")
                }
                CARDS[i].classList.add("white-text")
                CARDS[0].classList.add("blue", "darken-2")
                CARDS[1].classList.add("red", "darken-2")
                CARDS[2].classList.add("green", "darken-2")
                CARDS[3].classList.add("orange", "darken-2")
            }

            floatingActionButton.removeAttribute("style")
        })
    }
    //manually set path color
    materialYouPathColor = "ff0000"
    highLightPath()
}

const materialBlue = () => {
    localStorage.setItem("theme", "1")
    let isChecked = (document.getElementById("switch-dark") as HTMLInputElement).checked as any
    localStorage.setItem("dark", isChecked)
    if (isChecked) {
        document.body.style.backgroundImage =
            "linear-gradient(to right, #001946, #5d8ef3)"
        navBar.style.backgroundColor = "rgba(30, 136, 229, 0.6)"

        whiteTexts.forEach((text) => {
            text.removeAttribute("style")
        })

        COLORS.forEach((color) => {
            if (
                footer.classList.contains(color) ||
                footer.classList.contains("blue")
            ) {
                footer.classList.remove("blue")
                footer.classList.remove(color)
            }
            footer.removeAttribute("style")
            footer.classList.add("blue")

            if (floatingButton.classList.contains(color)) {
                floatingButton.classList.remove(color)
            }
            floatingActionButton.removeAttribute("style")
            floatingButton.classList.add("blue")

            NAV_BUTTONS.forEach((button) => {
                if (
                    button.classList.contains(color) ||
                    button.classList.contains("darken-4")
                ) {
                    button.classList.remove(color)
                    button.classList.remove("darken-4")
                }
                button.removeAttribute("style")
                button.classList.add("blue", "darken-4")

                ICONS.forEach((icon) => {
                    icon.removeAttribute("style")
                    icon.style.color = "#d8e2ff"
                })
            })

            CARDS.forEach((card) => {
                if (
                    card.classList.contains(color) ||
                    card.classList.contains("darken-2")
                ) {
                    card.classList.remove(color)
                    card.classList.remove("darken-2")
                }
                card.removeAttribute("style")
                card.classList.add("white-text")
                card.style.backgroundColor = "#00429c"
            })

            SOCIAL_BUTTONS.forEach((button) => {
                if (
                    button.classList.contains(color) ||
                    button.classList.contains("darken-4")
                ) {
                    button.classList.remove(color)
                    button.classList.remove("darken-4")
                }
                button.removeAttribute("style")
                button.classList.add("blue", "darken-4")
                button.style.color = "#d8e2ff"
            })
        })
    } else {
        navBar.style.backgroundColor = "rgba(30, 136, 229, 0.6)"
        document.body.style.backgroundImage =
            "linear-gradient(to left, #e3f2fd, #90caf9)"

        whiteTexts.forEach((text) => {
            text.removeAttribute("style")
        })

        COLORS.forEach((color) => {
            if (
                footer.classList.contains(color) ||
                footer.classList.contains("blue")
            ) {
                footer.classList.remove("blue")
                footer.classList.remove(color)
            }
            footer.removeAttribute("style")
            footer.classList.add("blue")

            if (floatingButton.classList.contains(color)) {
                floatingButton.classList.remove(color)
            }
            floatingActionButton.removeAttribute("style")
            floatingButton.classList.add("blue")

            NAV_BUTTONS.forEach((button) => {
                if (
                    button.classList.contains(color) ||
                    button.classList.contains("darken-4")
                ) {
                    button.classList.remove(color)
                    button.classList.remove("darken-4")
                }
                button.removeAttribute("style")
                button.classList.add("blue", "lighten-5")

                ICONS.forEach((icon) => {
                    icon.removeAttribute("style")
                    icon.style.color = "#1e90ff"
                })
            })

            CARDS.forEach((card) => {
                if (
                    card.classList.contains(color) ||
                    card.classList.contains("darken-2")
                ) {
                    card.classList.remove(color)
                }
                card.removeAttribute("style")
                card.classList.add("white-text")
                card.style.backgroundColor = "#1e5abc"
            })

            SOCIAL_BUTTONS.forEach((button) => {
                if (
                    button.classList.contains(color) ||
                    button.classList.contains("darken-4")
                ) {
                    button.classList.remove(color)
                    button.classList.remove("darken-4")
                }
                button.removeAttribute("style")
                button.classList.add("blue", "lighten-5")
                button.style.color = "#1e90ff"
            })
        })
    }
    //manually set the color for path
    materialYouPathColor = "#1e90ff"
    highLightPath()
}

const materialGreen = () => {
    localStorage.setItem("theme", "2")
    let isChecked = (document.getElementById("switch-dark") as HTMLInputElement).checked as any
    localStorage.setItem("dark", isChecked)
    if (isChecked) {
        document.body.style.backgroundImage =
            "linear-gradient(to right, #00210C, #2ba561)"
        navBar.style.backgroundColor = "rgba(102, 187, 106, 0.6)"

        whiteTexts.forEach((text) => {
            text.removeAttribute("style")
        })

        COLORS.forEach((color) => {
            if (footer.classList.contains(color)) {
                footer.classList.remove(color)
            }
            footer.removeAttribute("style")
            footer.classList.add("green")

            if (floatingButton.classList.contains(color)) {
                floatingButton.classList.remove(color)
            }
            floatingActionButton.removeAttribute("style")
            floatingButton.classList.add("green")

            NAV_BUTTONS.forEach((button) => {
                if (
                    button.classList.contains(color) ||
                    button.classList.contains("darken-4")
                ) {
                    button.classList.remove(color)
                    button.classList.remove("darken-4")
                }
                button.removeAttribute("style")
                button.classList.add("green", "darken-4")

                ICONS.forEach((icon) => {
                    icon.removeAttribute("style")
                    icon.style.color = "#d8ffe2"
                })
            })

            CARDS.forEach((card) => {
                if (
                    card.classList.contains(color) ||
                    card.classList.contains("darken-2")
                ) {
                    card.classList.remove(color)
                    card.classList.remove("darken-2")
                }
                card.removeAttribute("style")
                card.classList.add("white-text")
                card.style.backgroundColor = "#005229"
            })

            SOCIAL_BUTTONS.forEach((button) => {
                if (
                    button.classList.contains(color) ||
                    button.classList.contains("darken-4")
                ) {
                    button.classList.remove(color)
                    button.classList.remove("darken-4")
                }
                button.removeAttribute("style")
                button.classList.add("green", "darken-4")
                button.style.color = "#d8ffe2"
            })
        })
    } else {
        navBar.style.backgroundColor = "rgba(102, 187, 106, 0.6)"
        document.body.style.backgroundImage =
            "linear-gradient(to right, #81c784, #e8f5e9)"

        whiteTexts.forEach((text) => {
            text.removeAttribute("style")
        })

        COLORS.forEach((color) => {
            if (footer.classList.contains(color)) {
                footer.classList.remove(color)
            }
            footer.removeAttribute("style")
            footer.classList.add("green")

            if (floatingButton.classList.contains(color)) {
                floatingButton.classList.remove(color)
            }
            floatingActionButton.removeAttribute("style")
            floatingButton.classList.add("green")

            NAV_BUTTONS.forEach((button) => {
                if (
                    button.classList.contains(color) ||
                    button.classList.contains("lighten-5") ||
                    button.classList.contains("darken-4")
                ) {
                    button.classList.remove(color)
                    button.classList.remove("lighten-5")
                    button.classList.remove("darken-4")
                }
                button.removeAttribute("style")
                button.classList.add("green", "lighten-5")
            })

            ICONS.forEach((icon) => {
                icon.removeAttribute("style")
                icon.style.color = "#228B22"
            })

            CARDS.forEach((card) => {
                if (
                    card.classList.contains(color) ||
                    card.classList.contains("darken-2")
                ) {
                    card.classList.remove(color)
                }
                card.removeAttribute("style")
                card.classList.add("white-text")
                card.style.backgroundColor = "#006d38"
            })

            SOCIAL_BUTTONS.forEach((button) => {
                if (
                    button.classList.contains(color) ||
                    button.classList.contains("darken-4")
                ) {
                    button.classList.remove(color)
                    button.classList.remove("darken-4")
                }
                button.removeAttribute("style")
                button.classList.add("green", "lighten-5")
                button.style.color = "#228B22"
            })
        })
    }

    //manually set the color for path
    materialYouPathColor = "#228B22"
    highLightPath()
}

const materialRed = () => {
    localStorage.setItem("theme", "3")
    let isChecked = (document.getElementById("switch-dark") as HTMLInputElement).checked as any
    localStorage.setItem("dark", isChecked)
    if (isChecked) {
        document.body.style.backgroundImage =
            "linear-gradient(to right, #400010, #ff4f75)"
        navBar.style.backgroundColor = "rgba(239, 83, 80, 0.6)"

        whiteTexts.forEach((text) => {
            text.removeAttribute("style")
        })

        COLORS.forEach((color) => {
            if (footer.classList.contains(color)) {
                footer.classList.remove(color)
            }
            footer.removeAttribute("style")
            footer.classList.add("red")

            if (floatingButton.classList.contains(color)) {
                floatingButton.classList.remove(color)
            }
            floatingActionButton.removeAttribute("style")
            floatingButton.classList.add("red")

            NAV_BUTTONS.forEach((button) => {
                if (
                    button.classList.contains(color) ||
                    button.classList.contains("lighten-5") ||
                    button.classList.contains("darken-4")
                ) {
                    button.classList.remove(color)
                    button.classList.remove("lighten-5")
                    button.classList.remove("darken-4")
                }
                button.removeAttribute("style")
                button.classList.add("red", "darken-4")
            })

            ICONS.forEach((icon) => {
                icon.removeAttribute("style")
                icon.style.color = "#ffdade"
            })

            CARDS.forEach((card) => {
                if (
                    card.classList.contains(color) ||
                    card.classList.contains("darken-2")
                ) {
                    card.classList.remove(color)
                    card.classList.remove("darken-2")
                }
                card.removeAttribute("style")
                card.classList.add("white-text")
                card.style.backgroundColor = "#910030"
            })

            SOCIAL_BUTTONS.forEach((button) => {
                if (
                    button.classList.contains(color) ||
                    button.classList.contains("darken-4")
                ) {
                    button.classList.remove(color)
                    button.classList.remove("darken-4")
                }
                button.removeAttribute("style")
                button.classList.add("red", "darken-4")
                button.style.color = "#ffdade"
            })
        })
    } else {
        navBar.style.backgroundColor = "rgba(239, 83, 80, 0.6)"
        document.body.style.backgroundImage =
            "linear-gradient(to right, #e57373, #ffebee)"

        whiteTexts.forEach((text) => {
            text.removeAttribute("style")
        })

        COLORS.forEach((color) => {
            if (footer.classList.contains(color)) {
                footer.classList.remove(color)
            }
            footer.removeAttribute("style")
            footer.classList.add("red")

            if (floatingButton.classList.contains(color)) {
                floatingButton.classList.remove(color)
            }
            floatingActionButton.removeAttribute("style")
            floatingButton.classList.add("red")

            NAV_BUTTONS.forEach((button) => {
                if (
                    button.classList.contains(color) ||
                    button.classList.contains("lighten-5") ||
                    button.classList.contains("darken-4")
                ) {
                    button.classList.remove(color)
                    button.classList.remove("lighten-5")
                    button.classList.remove("darken-4")
                }
                button.removeAttribute("style")
                button.classList.add("red", "lighten-5")
            })

            ICONS.forEach((icon) => {
                icon.removeAttribute("style")
                icon.style.color = "#f44336"
            })

            CARDS.forEach((card) => {
                if (
                    card.classList.contains(color) ||
                    card.classList.contains("darken-2")
                ) {
                    card.classList.remove(color)
                }
                card.removeAttribute("style")
                card.classList.add("white-text")
                card.style.backgroundColor = "#ba0f44"
            })

            SOCIAL_BUTTONS.forEach((button) => {
                if (
                    button.classList.contains(color) ||
                    button.classList.contains("darken-4")
                ) {
                    button.classList.remove(color)
                    button.classList.remove("darken-4")
                }
                button.removeAttribute("style")
                button.classList.add("red", "lighten-5")
                button.style.color = "#f44336"
            })
        })
    }

    //manually set the color for path
    materialYouPathColor = "#f44336"
    highLightPath()
}

const materialYellow = () => {
    localStorage.setItem("theme", "4")
    let isChecked = (document.getElementById("switch-dark") as HTMLInputElement).checked as any
    localStorage.setItem("dark", isChecked)
    if (isChecked) {
        document.body.style.backgroundImage =
            "linear-gradient(to right, #390c00, #ed6833)"
        navBar.style.backgroundColor = "rgba(255, 183, 77, 0.6)"

        whiteTexts.forEach((text) => {
            text.removeAttribute("style")
        })

        COLORS.forEach((color) => {
            if (footer.classList.contains(color)) {
                footer.classList.remove(color)
            }
            footer.removeAttribute("style")
            footer.classList.add("orange")

            if (floatingButton.classList.contains(color)) {
                floatingButton.classList.remove(color)
            }
            floatingActionButton.removeAttribute("style")
            floatingButton.classList.add("orange")

            NAV_BUTTONS.forEach((button) => {
                if (
                    button.classList.contains(color) ||
                    button.classList.contains("lighten-5") ||
                    button.classList.contains("darken-4")
                ) {
                    button.classList.remove(color)
                    button.classList.remove("lighten-5")
                    button.classList.remove("darken-4")
                }
                button.removeAttribute("style")
                button.classList.add("orange", "darken-4")
            })

            ICONS.forEach((icon) => {
                icon.removeAttribute("style")
                icon.style.color = "#ffdbce"
            })

            CARDS.forEach((card) => {
                if (
                    card.classList.contains(color) ||
                    card.classList.contains("darken-2")
                ) {
                    card.classList.remove(color)
                    card.classList.remove("darken-2")
                }
                card.removeAttribute("style")
                card.classList.add("white-text")
                card.style.backgroundColor = "#822700"
            })

            SOCIAL_BUTTONS.forEach((button) => {
                if (
                    button.classList.contains(color) ||
                    button.classList.contains("darken-4")
                ) {
                    button.classList.remove(color)
                    button.classList.remove("darken-4")
                }
                button.removeAttribute("style")
                button.classList.add("orange", "darken-4")
                button.style.color = "#ffdbce"
            })
        })
    } else {
        navBar.style.backgroundColor = "rgba(255, 183, 77, 0.6)"
        document.body.style.backgroundImage =
            "linear-gradient(to right, #ffcc80, #fff3e0)"

        whiteTexts.forEach((text) => {
            text.removeAttribute("style")
        })

        COLORS.forEach((color) => {
            if (footer.classList.contains(color)) {
                footer.classList.remove(color)
            }
            footer.removeAttribute("style")
            footer.classList.add("orange")

            if (floatingButton.classList.contains(color)) {
                floatingButton.classList.remove(color)
            }
            floatingActionButton.removeAttribute("style")
            floatingButton.classList.add("orange")

            NAV_BUTTONS.forEach((button) => {
                if (
                    button.classList.contains(color) ||
                    button.classList.contains("lighten-5") ||
                    button.classList.contains("darken-4")
                ) {
                    button.classList.remove(color)
                    button.classList.remove("lighten-5")
                    button.classList.remove("darken-4")
                }
                button.removeAttribute("style")
                button.classList.add("orange", "lighten-5")
            })

            ICONS.forEach((icon) => {
                icon.removeAttribute("style")
                icon.style.color = "orange"
            })

            CARDS.forEach((card) => {
                if (
                    card.classList.contains(color) ||
                    card.classList.contains("darken-2")
                ) {
                    card.classList.remove(color)
                }
                card.removeAttribute("style")
                card.classList.add("white-text")
                card.style.backgroundColor = "#a93800"
            })

            SOCIAL_BUTTONS.forEach((button) => {
                if (
                    button.classList.contains(color) ||
                    button.classList.contains("darken-4")
                ) {
                    button.classList.remove(color)
                    button.classList.remove("darken-4")
                }
                button.removeAttribute("style")
                button.classList.add("orange", "lighten-5")
                button.style.color = "orange"
            })
        })
    }
    //manually set the color for path
    materialYouPathColor = "#ffa500" //for orange
    highLightPath()
}

const materialPurple = () => {
    localStorage.setItem("theme", "5")
    let isChecked = (document.getElementById("switch-dark") as HTMLInputElement).checked as any
    localStorage.setItem("dark", isChecked)
    if (isChecked) {
        document.body.style.backgroundImage =
            "linear-gradient(to right, #2f004c, #be6df2)"
        navBar.style.backgroundColor = "rgba(186, 104, 200, 0.6)"

        whiteTexts.forEach((text) => {
            text.removeAttribute("style")
        })

        COLORS.forEach((color) => {
            if (footer.classList.contains(color)) {
                footer.classList.remove(color)
            }
            footer.removeAttribute("style")
            footer.classList.add("purple")

            if (floatingButton.classList.contains(color)) {
                floatingButton.classList.remove(color)
            }
            floatingActionButton.removeAttribute("style")
            floatingButton.classList.add("purple")

            NAV_BUTTONS.forEach((button) => {
                if (
                    button.classList.contains(color) ||
                    button.classList.contains("lighten-5") ||
                    button.classList.contains("darken-4")
                ) {
                    button.classList.remove(color)
                    button.classList.remove("lighten-5")
                    button.classList.remove("darken-4")
                }
                button.removeAttribute("style")
                button.classList.add("purple", "darken-4")
            })

            ICONS.forEach((icon) => {
                icon.removeAttribute("style")
                icon.style.color = "#f6d9ff"
            })

            CARDS.forEach((card) => {
                if (
                    card.classList.contains(color) ||
                    card.classList.contains("darken-2")
                ) {
                    card.classList.remove(color)
                    card.classList.remove("darken-2")
                }
                card.removeAttribute("style")
                card.classList.add("white-text")
                card.style.backgroundColor = "#6d14a0"
            })

            SOCIAL_BUTTONS.forEach((button) => {
                if (
                    button.classList.contains(color) ||
                    button.classList.contains("darken-4")
                ) {
                    button.classList.remove(color)
                    button.classList.remove("darken-4")
                }
                button.removeAttribute("style")
                button.classList.add("purple", "darken-4")
                button.style.color = "#f6d9ff"
            })
        })
    } else {
        navBar.style.backgroundColor = "rgba(186, 104, 200, 0.6)"
        document.body.style.backgroundImage =
            "linear-gradient(to right, #ba68c8, #f3e5f5)"

        whiteTexts.forEach((text) => {
            text.removeAttribute("style")
        })

        COLORS.forEach((color) => {
            if (footer.classList.contains(color)) {
                footer.classList.remove(color)
            }
            footer.removeAttribute("style")
            footer.classList.add("purple")

            if (floatingButton.classList.contains(color)) {
                floatingButton.classList.remove(color)
            }
            floatingActionButton.removeAttribute("style")
            floatingButton.classList.add("purple")

            NAV_BUTTONS.forEach((button) => {
                if (
                    button.classList.contains(color) ||
                    button.classList.contains("lighten-5") ||
                    button.classList.contains("darken-4")
                ) {
                    button.classList.remove(color)
                    button.classList.remove("lighten-5")
                    button.classList.remove("darken-4")
                }
                button.removeAttribute("style")
                button.classList.add("purple", "lighten-5")
            })

            ICONS.forEach((icon) => {
                icon.removeAttribute("style")
                icon.style.color = "#ab47bc"
            })

            CARDS.forEach((card) => {
                if (
                    card.classList.contains(color) ||
                    card.classList.contains("darken-2")
                ) {
                    card.classList.remove(color)
                }
                card.removeAttribute("style")
                card.classList.add("white-text")
                card.style.backgroundColor = "#8736ba"
            })

            SOCIAL_BUTTONS.forEach((button) => {
                if (
                    button.classList.contains(color) ||
                    button.classList.contains("darken-4")
                ) {
                    button.classList.remove(color)
                    button.classList.remove("darken-4")
                }
                button.removeAttribute("style")
                button.classList.add("purple", "lighten-5")
                button.style.color = "#ab47bc"
            })
        })
    }

    //manually set the color for path
    materialYouPathColor = "#ab47bc"
    highLightPath()
}

const materialTeal = () => {
    localStorage.setItem("theme", "6")
    let isChecked = (document.getElementById("switch-dark") as HTMLInputElement).checked as any
    localStorage.setItem("dark", isChecked)
    if (isChecked) {
        document.body.style.background = "#011f22"
        document.body.style.backgroundImage =
            "linear-gradient(to right, #011f22, #00a0ac)"
        navBar.style.backgroundColor = "rgba(77, 182, 172, 0.6)"

        whiteTexts.forEach((text) => {
            text.removeAttribute("style")
        })

        COLORS.forEach((color) => {
            if (footer.classList.contains(color)) {
                footer.classList.remove(color)
            }
            footer.removeAttribute("style")
            footer.classList.add("teal")

            if (floatingButton.classList.contains(color)) {
                floatingButton.classList.remove(color)
            }
            floatingActionButton.removeAttribute("style")
            floatingButton.classList.add("teal")

            NAV_BUTTONS.forEach((button) => {
                if (
                    button.classList.contains(color) ||
                    button.classList.contains("lighten-5") ||
                    button.classList.contains("darken-4")
                ) {
                    button.classList.remove(color)
                    button.classList.remove("lighten-5")
                    button.classList.remove("darken-4")
                }
                button.removeAttribute("style")
                button.classList.add("teal", "darken-4")
            })

            ICONS.forEach((icon) => {
                icon.removeAttribute("style")
                icon.style.color = "#7cf4ff"
            })

            CARDS.forEach((card) => {
                if (
                    card.classList.contains(color) ||
                    card.classList.contains("darken-2")
                ) {
                    card.classList.remove(color)
                    card.classList.add("white-text")
                }
                card.removeAttribute("style")
                card.style.backgroundColor = "#004f56"
            })

            SOCIAL_BUTTONS.forEach((button) => {
                if (
                    button.classList.contains(color) ||
                    button.classList.contains("darken-4")
                ) {
                    button.classList.remove(color)
                    button.classList.remove("darken-4")
                }
                button.classList.add("teal", "darken-4")
                button.style.color = "#7cf4ff"
            })
        })
    } else {
        navBar.style.backgroundColor = "rgba(77, 182, 172, 0.6)"
        document.body.style.backgroundImage =
            "linear-gradient(to right, #4db6ac, #e0f2f1)"

        whiteTexts.forEach((text) => {
            text.removeAttribute("style")
        })

        COLORS.forEach((color) => {
            if (footer.classList.contains(color)) {
                footer.classList.remove(color)
            }
            footer.removeAttribute("style")
            footer.classList.add("teal")

            if (floatingButton.classList.contains(color)) {
                floatingButton.classList.remove(color)
            }
            floatingActionButton.removeAttribute("style")
            floatingButton.classList.add("teal")

            NAV_BUTTONS.forEach((button) => {
                if (
                    button.classList.contains(color) ||
                    button.classList.contains("lighten-5") ||
                    button.classList.contains("darken-4")
                ) {
                    button.classList.remove(color)
                    button.classList.remove("lighten-5")
                    button.classList.remove("darken-4")
                }
                button.removeAttribute("style")
                button.classList.add("teal", "lighten-5")
            })

            ICONS.forEach((icon) => {
                icon.removeAttribute("style")
                icon.style.color = "#26a69a"
            })

            CARDS.forEach((card) => {
                if (
                    card.classList.contains(color) ||
                    card.classList.contains("darken-2")
                ) {
                    card.classList.remove(color)
                }
                card.removeAttribute("style")
                card.classList.add("white-text")
                card.style.backgroundColor = "#006972"
            })

            SOCIAL_BUTTONS.forEach((button) => {
                if (
                    button.classList.contains(color) ||
                    button.classList.contains("darken-4")
                ) {
                    button.classList.remove(color)
                    button.classList.remove("darken-4")
                }
                button.removeAttribute("style")
                button.classList.add("teal", "lighten-5")
                button.style.color = "#26a69a"
            })
        })
    }

    //manually set the color for path
    materialYouPathColor = "#26a69a"
    highLightPath()
}

// dark mode
const switchTheme = () => {
	localStorage.theme === "0" && materialColorfulBtn.click()
	localStorage.theme === "1" && materialBlueBtn.click()
	localStorage.theme === "2" && materialGreenBtn.click()
	localStorage.theme === "3" && materialRedBtn.click()
	localStorage.theme === "4" && materialYellowBtn.click()
	localStorage.theme === "5" && materialPurpleBtn.click()
	localStorage.theme === "6" && materialTealBtn.click()
}

// Easter Egg
const easter = document.getElementById("easter") as HTMLInputElement
const audio = new Audio("./src/sounds/party-trumpet.wav")

const easterEgg = () => {
	if (easter.value === "")
		M.toast({ html: "Write Something First!", classes: "rounded red" })
	else if (easter.value === "Mapify") {
		audio.play()
		easterEggMaterialYou()
		easter.value = ""
	} else {
		M.toast({ html: "Better luck next time!", classes: "rounded orange" })
		easter.value = ""
	}
}

const materialUActionButton = document.getElementById("m-u") as HTMLLIElement

const easterEggMaterialYou = () => {
	materialUActionButton.removeAttribute("style")
	M.toast({
		html: "Material You Limitless Unlocked! Check Theme Now.",
		classes: "rounded green",
		displayLength: 6000,
	})
}

materialUActionButton.onclick = () => {
	navBar.removeAttribute("style")
	navBar.style.backgroundColor = `var(--md-sys-color-primary)`
	navBar.style.opacity = `0.9`
	document.body.style.background = `var(--md-sys-color-primary-container)`
	document.body.style.color = `var(--md-sys-color-on-primary-container)`

	COLORS.forEach((color) => {
		for (let i = 0; i < NAV_BUTTONS.length; i++) {
			if (
				NAV_BUTTONS[i].classList.contains(color) ||
				NAV_BUTTONS[i].classList.contains("lighten-5") ||
				NAV_BUTTONS[i].classList.contains("darken-4")
			) {
				NAV_BUTTONS[i].classList.remove(color)
				NAV_BUTTONS[i].classList.remove("lighten-5")
				NAV_BUTTONS[i].classList.remove("darken-4")
				NAV_BUTTONS[i].removeAttribute("style")
				NAV_BUTTONS[
					i
				].style.backgroundColor = `var(--md-sys-color-primary-container)`
			}
		}

		ICONS.forEach((icon) => {
			icon.removeAttribute("style")
			icon.style.color = `var(--md-sys-color-on-primary-container)`
		})

		for (let i = 0; i < CARDS.length; i++) {
			if (CARDS[i].classList.contains(color)) {
				CARDS[i].classList.remove(color)
				CARDS[i].removeAttribute("style")
			}
			CARDS[i].style.backgroundColor = `var(--md-sys-color-tertiary)`
		}

		if (footer.classList.contains(color)) {
			footer.classList.remove(color)
		}
		footer.style.backgroundColor = `var(--md-sys-color-on-primary-container)`
		whiteTexts.forEach((text) => {
			text.removeAttribute("style")
			text.classList.remove("white-text")
			// text.style.color = `var(--md-sys-color-primary-container)`
		})

		for (let i = 0; i < SOCIAL_BUTTONS.length; i++) {
			if (
				SOCIAL_BUTTONS[i].classList.contains(color) ||
				SOCIAL_BUTTONS[i].classList.contains("lighten-5") ||
				SOCIAL_BUTTONS[i].classList.contains("darken-4")
			) {
				SOCIAL_BUTTONS[i].classList.remove(color)
				SOCIAL_BUTTONS[i].classList.remove("lighten-5")
				SOCIAL_BUTTONS[i].classList.remove("darken-4")
				SOCIAL_BUTTONS[i].removeAttribute("style")
				SOCIAL_BUTTONS[
					i
				].style.backgroundColor = `var(--md-sys-color-tertiary-container)`
				SOCIAL_BUTTONS[
					i
				].style.color = `var(--md-sys-color-on-tertiary-container)`
			}
			SOCIAL_BUTTONS[
				i
			].style.backgroundColor = `var(--md-sys-color-tertiary-container)`
			SOCIAL_BUTTONS[
				i
			].style.color = `var(--md-sys-color-on-tertiary-container)`
		}
	})
}

export {
    materialColorful,
    materialBlue,
    materialGreen,
    materialRed,
    materialYellow,
    materialPurple,
    materialTeal,

    switchTheme,
    easterEgg,

    materialYouPathColor
}