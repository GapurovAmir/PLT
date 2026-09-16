class Product:
    def __init__(self, name, price, quantity, category="общего назначения"):
        self.name = name                 # Название товара (публичный атрибут)
        self.__price = price             # Цена (закрытый атрибут для инкапсуляции)
        self.quantity = quantity         # Количество на складе
        self.category = category         # Дополнительный атрибут (доп. задание)

    def change_price(self, new_price):
        """Метод изменения цены товара"""
        if new_price >= 0:
            self.__price = new_price
            print(f"[{self.name}] Новая цена установлена: {self.__price} тг.")
        else:
            print(f"[{self.name}] Ошибка: цена не может быть отрицательной.")

    def add_quantity(self, amount):
        """Метод добавления товара на склад"""
        if amount > 0:
            self.quantity += amount
            print(f"[{self.name}] Склад пополнен на {amount} шт. Всего: {self.quantity} шт.")
        else:
            print(f"[{self.name}] Ошибка: количество для добавления должно быть больше нуля.")

    def get_total_value(self):
        """Метод вычисления общей стоимости запасов"""
        total = self.__price * self.quantity
        return total

    def get_price(self):
        """Геттер для безопасного получения закрытой цены"""
        return self.__price

    def apply_discount(self, percent):
        """Дополнительный метод (доп. задание): применение скидки в процентах"""
        if 0 < percent <= 100:
            discount = self.__price * (percent / 100)
            self.__price -= discount
            print(f"[{self.name}] Применена скидка {percent}%. Новая цена со скидкой: {self.__price} тг.")
        else:
            print("Ошибка: некорректный процент скидки.")


# --- Тестирование программы ---
if __name__ == "__main__":
    print("--- Тестовый сценарий 1: Создание объектов и расчет стоимости запасов ---")
    p1 = Product("Ноутбук", 350000, 5, "Электроника")
    p2 = Product("Мышь компьютерная", 8000, 25, "Электроника")
    p3 = Product("Офисная бумага", 2500, 50, "Канцтовары")

    print(f"Товар: {p1.name} | Цена: {p1.get_price()} тг. | Количество: {p1.quantity} шт.")
    print(f"Общая стоимость запасов '{p1.name}': {p1.get_total_value()} тг.\n")

    print("--- Тестовый сценарий 2: Изменение состояния (пополнение склада и изменение цены) ---")
    p2.add_quantity(10) # Пополняем запас мышек
    p2.change_price(7500) # Меняем цену
    print(f"Общая стоимость запасов '{p2.name}' после изменений: {p2.get_total_value()} тг.\n")

    print("--- Тестовый сценарий 3: Проверка дополнительного метода и атрибута ---")
    print(f"Товар '{p3.name}' относится к категории: {p3.category}")
    p3.apply_discount(10) # Применяем скидку 10%
    print(f"Общая стоимость запасов '{p3.name}' после скидки: {p3.get_total_value()} тг.")