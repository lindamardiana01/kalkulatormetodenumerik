document.addEventListener('DOMContentLoaded', function() {
    // Elemen DOM
    const calculateBtn = document.getElementById('calculate-btn');
    const functionInput = document.getElementById('function');
    const xValueInput = document.getElementById('x-value');
    const hValueInput = document.getElementById('h-value');
    const backwardResult = document.getElementById('backward-result');
    const centralResult = document.getElementById('central-result');
    const backwardSteps = document.getElementById('backward-steps');
    const centralSteps = document.getElementById('central-steps');
    const comparisonResult = document.getElementById('comparison-result');
    
    // Inisialisasi grafik
    const functionCtx = document.getElementById('function-chart').getContext('2d');
    const derivativeCtx = document.getElementById('derivative-chart').getContext('2d');
    
    let functionChart = null;
    let derivativeChart = null;
    
    // Event listener untuk tombol hitung
    calculateBtn.addEventListener('click', calculateDerivative);
    
    // Fungsi untuk menghitung turunan
    function calculateDerivative() {
        // Ambil nilai input
        const funcStr = functionInput.value;
        const x = parseFloat(xValueInput.value);
        const h = parseFloat(hValueInput.value);
        
        // Validasi input
        if (isNaN(x) || isNaN(h) || h <= 0) {
            alert('Masukkan nilai x dan h yang valid (h > 0)');
            return;
        }
        
        try {
            // Buat fungsi dari string input
            const func = new Function('x', `return ${funcStr};`);
            
            // Hitung nilai fungsi di berbagai titik
            const fx = func(x);
            const fxMinusH = func(x - h);
            const fxPlusH = func(x + h);
            
            // Hitung turunan dengan metode selisih mundur
            const backwardDerivative = (fx - fxMinusH) / h;
            
            // Hitung turunan dengan metode selisih pusat
            const centralDerivative = (fxPlusH - fxMinusH) / (2 * h);
            
            // Tampilkan hasil
            backwardResult.innerHTML = `f'(${x}) ≈ ${backwardDerivative.toFixed(6)}`;
            centralResult.innerHTML = `f'(${x}) ≈ ${centralDerivative.toFixed(6)}`;
            
            // Tampilkan langkah-langkah
            backwardSteps.innerHTML = `Langkah-langkah Selisih Mundur:
1. Hitung f(${x}) = ${fx.toFixed(6)}
2. Hitung f(${x-h}) = ${fxMinusH.toFixed(6)}
3. Hitung selisih: f(${x}) - f(${x-h}) = ${(fx - fxMinusH).toFixed(6)}
4. Bagi dengan h: (${(fx - fxMinusH).toFixed(6)}) / ${h} = ${backwardDerivative.toFixed(6)}`;
            
            centralSteps.innerHTML = `Langkah-langkah Selisih Pusat:
1. Hitung f(${x+h}) = ${fxPlusH.toFixed(6)}
2. Hitung f(${x-h}) = ${fxMinusH.toFixed(6)}
3. Hitung selisih: f(${x+h}) - f(${x-h}) = ${(fxPlusH - fxMinusH).toFixed(6)}
4. Bagi dengan 2h: (${(fxPlusH - fxMinusH).toFixed(6)}) / (2*${h}) = ${centralDerivative.toFixed(6)}`;
            
            // Tampilkan perbandingan
            const difference = Math.abs(backwardDerivative - centralDerivative);
            comparisonResult.innerHTML = `
                <p>Perbedaan antara kedua metode: ${difference.toFixed(6)}</p>
                <p>Selisih Mundur menggunakan satu titik sebelum ${x}, sedangkan Selisih Pusat menggunakan titik sebelum dan sesudah ${x}.</p>
                <p>Metode Selisih Pusat umumnya lebih akurat karena error-nya sebanding dengan h², sedangkan Selisih Mundur error-nya sebanding dengan h.</p>
            `;
            
            // Gambar grafik fungsi dan turunannya
            drawFunctionChart(func, x, h);
            drawDerivativeChart(func, x, h, backwardDerivative, centralDerivative);
            
        } catch (error) {
            alert('Error dalam fungsi: ' + error.message);
            console.error(error);
        }
    }
    
    // Fungsi untuk menggambar grafik fungsi
    function drawFunctionChart(func, x, h) {
        // Siapkan data untuk grafik
        const range = 2 * h;
        const start = x - range;
        const end = x + range;
        const step = range / 20;
        
        const labels = [];
        const data = [];
        
        for (let xi = start; xi <= end; xi += step) {
            labels.push(xi.toFixed(2));
            data.push(func(xi));
        }
        
        // Hancurkan grafik sebelumnya jika ada
        if (functionChart) {
            functionChart.destroy();
        }
        
        // Buat grafik baru
        functionChart = new Chart(functionCtx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: `f(x) = ${functionInput.value}`,
                    data: data,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Grafik Fungsi'
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'x'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'f(x)'
                        }
                    }
                }
            }
        });
    }
    
    // Fungsi untuk menggambar grafik turunan
    function drawDerivativeChart(func, x, h, backwardDerivative, centralDerivative) {
        // Siapkan data untuk grafik
        const range = 2 * h;
        const start = x - range;
        const end = x + range;
        const step = range / 20;
        
        const labels = [];
        const backwardData = [];
        const centralData = [];
        
        for (let xi = start; xi <= end; xi += step) {
            labels.push(xi.toFixed(2));
            
            // Hitung turunan selisih mundur di setiap titik
            const fx = func(xi);
            const fxMinusH = func(xi - h);
            backwardData.push((fx - fxMinusH) / h);
            
            // Hitung turunan selisih pusat di setiap titik
            const fxPlusH = func(xi + h);
            centralData.push((fxPlusH - fxMinusH) / (2 * h));
        }
        
        // Hancurkan grafik sebelumnya jika ada
        if (derivativeChart) {
            derivativeChart.destroy();
        }
        
        // Buat grafik baru
        derivativeChart = new Chart(derivativeCtx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Turunan Selisih Mundur',
                        data: backwardData,
                        borderColor: 'rgb(54, 162, 235)',
                        backgroundColor: 'rgba(54, 162, 235, 0.1)',
                        borderWidth: 2,
                        tension: 0.1
                    },
                    {
                        label: 'Turunan Selisih Pusat',
                        data: centralData,
                        borderColor: 'rgb(75, 192, 192)',
                        backgroundColor: 'rgba(75, 192, 192, 0.1)',
                        borderWidth: 2,
                        tension: 0.1
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Perbandingan Turunan Numerik'
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'x'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: "f'(x)"
                        }
                    }
                }
            }
        });
    }
    
    // Hitung turunan saat halaman pertama kali dimuat
    calculateDerivative();
});