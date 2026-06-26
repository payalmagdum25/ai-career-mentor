document.addEventListener("DOMContentLoaded", () => {
    // Theme Toggling Logic
    const themeToggleBtn = document.getElementById("theme-toggle");
    const currentTheme = localStorage.getItem("theme");

    if (currentTheme) {
        document.documentElement.setAttribute("data-theme", currentTheme);
        updateThemeIcon(currentTheme);
    }

    if(themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            let theme = document.documentElement.getAttribute("data-theme");
            if (theme === "dark") {
                document.documentElement.setAttribute("data-theme", "light");
                localStorage.setItem("theme", "light");
                updateThemeIcon("light");
            } else {
                document.documentElement.setAttribute("data-theme", "dark");
                localStorage.setItem("theme", "dark");
                updateThemeIcon("dark");
            }
        });
    }

    function updateThemeIcon(theme) {
        if(!themeToggleBtn) return;
        if (theme === "dark") {
            themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
        }
    }

    // Number Counter Animation for Dashboard
    const counters = document.querySelectorAll('.counter-value');
    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const inc = target / 200; // Adjust speed here

            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(updateCount, 10);
            } else {
                counter.innerText = target;
            }
        };
        updateCount();
    });
});

// Toast Notifications Helper
function showToast(icon, title, text) {
    Swal.fire({
        icon: icon,
        title: title,
        text: text,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: document.documentElement.getAttribute("data-theme") === "dark" ? '#1F2937' : '#FFFFFF',
        color: document.documentElement.getAttribute("data-theme") === "dark" ? '#F9FAFB' : '#1F2937'
    });
}
