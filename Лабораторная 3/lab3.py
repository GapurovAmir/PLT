class Student:
    def __init__(self, name, age, specialty):
        self.name = name
        self.age = age
        self.specialty = specialty
        self.course = 1  # дополнительный атрибут

    def show_info(self):
        print(f"Имя: {self.name}")
        print(f"Возраст: {self.age}")
        print(f"Специальность: {self.specialty}")
        print(f"Курс: {self.course}")
        print()

    def change_specialty(self, new_specialty):
        self.specialty = new_specialty

    def change_course(self, new_course):
        self.course = new_course

    def birthday(self):
        self.age += 1


# Создание трех объектов
student1 = Student("Амир", 18, "Программная инженерия")
student2 = Student("Аян", 19, "Информационные технологии")
student3 = Student("Данияр", 20, "Компьютерные науки")

# Тест 1: вывод информации
print("=== Тест 1 ===")
student1.show_info()

# Тест 2: изменение специальности
print("=== Тест 2 ===")
student1.change_specialty("Информационные технологии")
student1.show_info()

# Тест 3: изменение курса и возраста
print("=== Тест 3 ===")
student1.change_course(2)
student1.birthday()
student1.show_info()
