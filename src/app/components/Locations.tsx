<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Carousel Example</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <style>
        .swiper-container {
            width: 100%;
            height: 100%;
        }
        .swiper-slide {
            display: flex;
            justify-content: center;
            align-items: center;
        }
    </style>
</head>
<body class="bg-lime-500 flex items-center justify-center min-h-screen">
    <div class="text-center text-white">
        <h1 class="text-3xl mb-4">Estamos en tu zona</h1>
        <p class="mb-8">Buscá tu localidad y contactate con un asesor</p>
    </div>
    <div class="swiper-container w-full max-w-4xl">
        <div class="swiper-wrapper">
            <!-- Slide 1 -->
            <div class="swiper-slide bg-white rounded-lg p-4">
                <h2 class="text-2xl font-bold text-center text-lime-500 mb-4">ZONA 2</h2>
                <div class="grid grid-cols-2 gap-4">
                    <div class="text-center">
                        <p>Bahía Blanca (Bs.As)</p>
                        <p>Coronel Dorrego (Bs.As)</p>
                        <p>Coronel Pringles (Bs.As)</p>
                    </div>
                    <div class="text-center">
                        <p>Monte Hermoso (Bs.As)</p>
                        <p>Punta Alta (Bs.As)</p>
                        <p>Saavedra (Bs.As)</p>
                    </div>
                    <div class="text-center">
                        <p>Saldungaray (Bs.As)</p>
                        <p>Sierra De La Ventana (Bs.As)</p>
                        <p>Tornquist (Bs.As)</p>
                    </div>
                </div>
                <div class="text-center mt-4">
                    <a href="tel:2926464895" class="block bg-green-500 text-white py-2 px-4 rounded">📞 2926 464895</a>
                </div>
            </div>
            <!-- Add more slides as needed -->
        </div>
        <!-- Add Pagination -->
        <div class="swiper-pagination"></div>
        <!-- Add Navigation -->
        <div class="swiper-button-next"></div>
        <div class="swiper-button-prev"></div>
    </div>

    <script src="https://unpkg.com/swiper/swiper-bundle.min.js"></script>
    <link rel="stylesheet" href="https://unpkg.com/swiper/swiper-bundle.min.css" />
    <script>
        var swiper = new Swiper('.swiper-container', {
            loop: true,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });
    </script>
</body>
</html>
