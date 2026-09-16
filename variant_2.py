import math

# Ввод данных
length = float(input("Введите длину прямоугольника: "))
width = float(input("Введите ширину прямоугольника: "))

# Вычисления
area = length * width
perimeter = 2 * (length + width)
diagonal = math.sqrt(length**2 + width**2)

# Вывод результатов
print(f"Площадь: {area}")
print(f"Периметр: {perimeter}")
print(f"Длина диагонали: {diagonal}")