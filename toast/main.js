function toast({
    title = '',
    message = '',
    type = 'success',
    duration = 3000
}) {
    const main = document.getElementById('toast')
    if (main) {
        const toast = document.createElement('div');

        const icons = {
            success: 'fas fa-check',
            info: 'fas fa-info',
            warning: 'fas fa-exclamation',
            error: 'fas fa-exclamation-triangle'
        }
        const delay = (duration / 1000).toFixed(2);
        const timeAnimation = 400;
        toast.classList.add('toast', `toast-${type}`);
        toast.style.animation = `slideInLeft ease .5s, slideInRight linear ${timeAnimation/1000}s ${delay}s forwards`

        toast.innerHTML = `
                <div class="toast__icon"><i class="${icons[type]}"></i></div>
                <div class="toast__body">
                    <h3 class="toast__title">${title}</h3>
                    <p class="toast__msg">${message}</p>
                </div>
                <div class="toast__close"><i class="fas fa-times"></i></div>
        `
        main.appendChild(toast);
        const autoRemoveID = setTimeout(function () {
            main.removeChild(toast)
        }, duration + timeAnimation)

        toast.onclick = function (e) {
            if (e.target.closest('.toast__close'))
                main.removeChild(toast)
            clearTimeout(autoRemoveID)
        }
    }
}