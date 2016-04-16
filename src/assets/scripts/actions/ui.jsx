
export function loadingChanged(isLoading) {
    console.log('loadingChanged():', isLoading)
    return {
        type: "IS_LOADING",
        isLoading
    }
}

export function submittingChanged(isSubmitting) {
    console.log('submittingChanged():', isSubmitting)
    return {
        type: "IS_SUBMITTING",
        isSubmitting
    }
}

