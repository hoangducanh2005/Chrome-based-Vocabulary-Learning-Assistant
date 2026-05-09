document.addEventListener('DOMContentLoaded', () => {
    const title = document.getElementById('title');
    const subtitle = document.getElementById('subtitle');

    // Add a nice hover effect or console message
    console.log("%c🚀 Hello World script initialized!", "color: #6366f1; font-size: 20px; font-weight: bold;");

    // Dynamic greeting based on time
    const hour = new Date().getHours();
    let greeting = "Xin chào Thế giới!";
    
    if (hour < 12) greeting = "Chào buổi sáng!";
    else if (hour < 18) greeting = "Chào buổi chiều!";
    else greeting = "Chào buổi tối!";

    title.textContent = greeting;

    // Subtle interaction: follow mouse slightly
    document.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const x = (clientX / window.innerWidth - 0.5) * 20;
        const y = (clientY / window.innerHeight - 0.5) * 20;
        
        const card = document.querySelector('.glass-card');
        card.style.transform = `translate(${x}px, ${y}px)`;
    });
});
