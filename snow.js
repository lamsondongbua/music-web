function createSnowflake() {
    const snowflake = document.createElement("div");
    snowflake.classList.add("snowflake");

    // Kích thước ngẫu nhiên (5px - 10px)
    const size = Math.random() * 5 + 5;
    snowflake.style.width = `${size}px`;
    snowflake.style.height = `${size}px`;

    // Xuất hiện ngẫu nhiên trên toàn màn hình
    snowflake.style.left = `${Math.random() * window.innerWidth}px`;
    snowflake.style.top = "-10px"; // Xuất hiện từ trên trời
    snowflake.style.opacity = Math.random() * 0.7 + 0.3; // Làm trong suốt nhẹ để tự nhiên hơn
    document.querySelector(".snow-container").appendChild(snowflake);

    // Tốc độ rơi ngẫu nhiên từ 5 - 10 giây
    const fallDuration = Math.random() * 5 + 5;

    // Rơi xuống toàn bộ chiều cao của trang
    snowflake.style.transition = `top ${fallDuration}s linear`;
    setTimeout(() => {
        snowflake.style.top = `${window.innerHeight}px`;
    }, 10);

    // Xóa tuyết khi chạm đáy để tránh tràn bộ nhớ
    setTimeout(() => {
        snowflake.remove();
    }, fallDuration * 1000);
}

// Tạo tuyết liên tục mỗi 200ms
setInterval(createSnowflake, 200);
