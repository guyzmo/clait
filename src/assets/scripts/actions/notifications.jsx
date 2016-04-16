
export function showSuccessNotification(message) {
    console.log('showSuccessNotification():', message)
    return {
        type: 'SHOW_NOTIFICATION',
        notification_type: 'SUCCESS',
        message
    }
}

export function showErrorNotification(message) {
    console.log('showErrorNotification():', message)
    return {
        type: 'SHOW_NOTIFICATION',
        notification_type: 'ERROR',
        message
    }
}

export function hideNotification() {
    console.log('hideNotification()' )
    return {
        type: 'CLEAR_NOTIFICATION'
    }
}
