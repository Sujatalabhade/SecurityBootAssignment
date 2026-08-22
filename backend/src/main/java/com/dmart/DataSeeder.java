package com.dmart;

import com.dmart.entity.Category;
import com.dmart.entity.Product;
import com.dmart.entity.User;
import com.dmart.enums.Role;
import com.dmart.repository.CategoryRepository;
import com.dmart.repository.ProductRepository;
import com.dmart.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository, CategoryRepository categoryRepository,
                      ProductRepository productRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            seedUsers();
            seedCategoriesAndProducts();
        }
    }

    private void seedUsers() {
        User admin = User.builder()
                .name("Admin User")
                .email("admin@dmart.com")
                .password(passwordEncoder.encode("Admin@123"))
                .role(Role.ADMIN)
                .phone("1234567890")
                .address("HQ")
                .active(true)
                .build();

        User manager = User.builder()
                .name("Manager User")
                .email("manager@dmart.com")
                .password(passwordEncoder.encode("Manager@123"))
                .role(Role.MANAGER)
                .phone("1234567891")
                .address("Branch 1")
                .active(true)
                .build();

        User staff = User.builder()
                .name("Staff User")
                .email("staff@dmart.com")
                .password(passwordEncoder.encode("Staff@123"))
                .role(Role.STAFF)
                .phone("1234567892")
                .address("Branch 1")
                .active(true)
                .build();

        User customer = User.builder()
                .name("Customer User")
                .email("customer@dmart.com")
                .password(passwordEncoder.encode("Customer@123"))
                .role(Role.CUSTOMER)
                .phone("1234567893")
                .address("123 Customer St")
                .active(true)
                .build();

        userRepository.saveAll(List.of(admin, manager, staff, customer));
    }

    private void seedCategoriesAndProducts() {
        Category fruitsVeg = Category.builder().name("Fruits & Vegetables").description("Fresh produce").imageUrl("").active(true).build();
        Category dairyEggs = Category.builder().name("Dairy & Eggs").description("Milk, cheese, eggs").imageUrl("").active(true).build();
        Category bakery = Category.builder().name("Bakery").description("Bread and pastries").imageUrl("").active(true).build();
        Category beverages = Category.builder().name("Beverages").description("Drinks and juices").imageUrl("").active(true).build();
        Category snacks = Category.builder().name("Snacks & Sweets").description("Chips and chocolates").imageUrl("").active(true).build();
        Category personalCare = Category.builder().name("Personal Care").description("Soap and shampoo").imageUrl("").active(true).build();

        categoryRepository.saveAll(List.of(fruitsVeg, dairyEggs, bakery, beverages, snacks, personalCare));

        Product p1 = createProduct(fruitsVeg, "Apple", "Fresh red apples", 150, 180, 100, "1 kg");
        Product p2 = createProduct(fruitsVeg, "Banana", "Yellow bananas", 60, 70, 200, "1 dozen");
        Product p3 = createProduct(fruitsVeg, "Potato", "Fresh potatoes", 40, 50, 500, "1 kg");
        Product p4 = createProduct(fruitsVeg, "Onion", "Red onions", 50, 60, 500, "1 kg");

        Product p5 = createProduct(dairyEggs, "Milk", "Full cream milk", 65, 70, 150, "1 L");
        Product p6 = createProduct(dairyEggs, "Eggs", "Farm fresh eggs", 80, 90, 100, "12 pcs");
        Product p7 = createProduct(dairyEggs, "Butter", "Salted butter", 250, 260, 50, "500 g");
        Product p8 = createProduct(dairyEggs, "Cheese", "Cheddar cheese", 150, 160, 50, "200 g");

        Product p9 = createProduct(bakery, "White Bread", "Sliced white bread", 40, 45, 100, "1 packet");
        Product p10 = createProduct(bakery, "Croissant", "Butter croissant", 60, 75, 50, "1 pc");
        Product p11 = createProduct(bakery, "Muffins", "Blueberry muffins", 120, 140, 40, "4 pcs");
        Product p12 = createProduct(bakery, "Buns", "Burger buns", 30, 35, 60, "4 pcs");

        Product p13 = createProduct(beverages, "Cola", "Carbonated drink", 40, 45, 200, "600 ml");
        Product p14 = createProduct(beverages, "Orange Juice", "Fresh juice", 110, 120, 100, "1 L");
        Product p15 = createProduct(beverages, "Green Tea", "Healthy green tea", 150, 180, 80, "250 g");
        Product p16 = createProduct(beverages, "Coffee", "Instant coffee", 300, 350, 50, "200 g");

        Product p17 = createProduct(snacks, "Potato Chips", "Salted chips", 20, 25, 300, "100 g");
        Product p18 = createProduct(snacks, "Chocolate Bar", "Milk chocolate", 50, 60, 200, "50 g");
        Product p19 = createProduct(snacks, "Cookies", "Choco chip cookies", 80, 90, 150, "200 g");
        Product p20 = createProduct(snacks, "Mixed Nuts", "Roasted nuts", 400, 450, 40, "250 g");

        Product p21 = createProduct(personalCare, "Soap", "Bath soap", 35, 40, 200, "1 pc");
        Product p22 = createProduct(personalCare, "Shampoo", "Hair shampoo", 180, 200, 100, "400 ml");
        Product p23 = createProduct(personalCare, "Toothpaste", "Fluoride toothpaste", 90, 100, 150, "150 g");
        Product p24 = createProduct(personalCare, "Body Lotion", "Moisturizing lotion", 250, 280, 60, "300 ml");

        productRepository.saveAll(List.of(p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12,
                p13, p14, p15, p16, p17, p18, p19, p20, p21, p22, p23, p24));
    }

    private Product createProduct(Category category, String name, String desc, double price, double mrp, int stock, String unit) {
        return Product.builder()
                .category(category)
                .name(name)
                .description(desc)
                .price(BigDecimal.valueOf(price))
                .mrp(BigDecimal.valueOf(mrp))
                .stockQty(stock)
                .unit(unit)
                .imageUrl("")
                .active(true)
                .build();
    }
}
