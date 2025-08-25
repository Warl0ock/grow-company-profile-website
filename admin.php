<?php
session_start();

// Simple authentication (in production, use proper authentication)
$admin_password = "admin123"; // Change this to a secure password
$is_authenticated = isset($_SESSION['admin_authenticated']) && $_SESSION['admin_authenticated'] === true;

// Handle login
if (isset($_POST['login'])) {
    if ($_POST['password'] === $admin_password) {
        $_SESSION['admin_authenticated'] = true;
        $is_authenticated = true;
    } else {
        $login_error = "Password salah!";
    }
}

// Handle logout
if (isset($_GET['logout'])) {
    session_destroy();
    header('Location: admin.php');
    exit;
}

// Handle form submission
$message = '';
if ($is_authenticated && $_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['update_content'])) {
    // Get form data
    $slider_image = $_POST['slider_image'] ?? '';
    $carousel_items = $_POST['carousel_items'] ?? [];
    
    // Validate data
    if (empty($slider_image)) {
        $message = 'Error: Slider image URL is required!';
    } else {
        // Save to JSON file (in production, use a database)
        $data = [
            'slider_image' => $slider_image,
            'carousel_items' => $carousel_items,
            'updated_at' => date('Y-m-d H:i:s')
        ];
        
        if (file_put_contents('data/content.json', json_encode($data, JSON_PRETTY_PRINT))) {
            $message = 'Content updated successfully!';
        } else {
            $message = 'Error: Could not save data!';
        }
    }
}

// Load existing data
$existing_data = [];
if (file_exists('data/content.json')) {
    $json_data = file_get_contents('data/content.json');
    $existing_data = json_decode($json_data, true) ?? [];
}

// Default carousel items
$default_carousel_items = [
    [
        'image' => 'https://placehold.co/400x300?text=Digital+Printing+Services',
        'title' => 'Digital Printing',
        'description' => 'High-quality digital printing solutions for all your business needs'
    ],
    [
        'image' => 'https://placehold.co/400x300?text=Display+System+Solutions',
        'title' => 'Display Systems',
        'description' => 'Modern display systems that capture attention and engage audiences'
    ],
    [
        'image' => 'https://placehold.co/400x300?text=Exhibition+Booth+Design',
        'title' => 'Booth Exhibitions',
        'description' => 'Creative booth designs that make your brand stand out at events'
    ],
    [
        'image' => 'https://placehold.co/400x300?text=Outdoor+Advertising+Solutions',
        'title' => 'Outdoor Advertising',
        'description' => 'Eye-catching outdoor advertising that reaches your target audience'
    ],
    [
        'image' => 'https://placehold.co/400x300?text=Creative+Design+Services',
        'title' => 'Creative Design',
        'description' => 'Innovative design solutions that bring your vision to life'
    ],
    [
        'image' => 'https://placehold.co/400x300?text=Brand+Identity+Solutions',
        'title' => 'Brand Identity',
        'description' => 'Complete brand identity packages for modern businesses'
    ]
];

$carousel_items = $existing_data['carousel_items'] ?? $default_carousel_items;
$slider_image = $existing_data['slider_image'] ?? 'https://placehold.co/1920x1080?text=GROW+Digital+Printing+Solutions';
?>

<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Panel - GROW</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/admin.css">
</head>
<body>
    <?php if (!$is_authenticated): ?>
        <!-- Login Form -->
        <div class="login-container">
            <div class="login-form">
                <div class="login-header">
                    <h1 class="brand-logo">GROW</h1>
                    <h2>Admin Login</h2>
                </div>
                
                <?php if (isset($login_error)): ?>
                    <div class="error-message"><?php echo htmlspecialchars($login_error); ?></div>
                <?php endif; ?>
                
                <form method="POST">
                    <div class="form-group">
                        <label for="password">Password:</label>
                        <input type="password" id="password" name="password" required>
                    </div>
                    <button type="submit" name="login" class="login-btn">Login</button>
                </form>
                
                <div class="login-footer">
                    <a href="index.html">← Back to Website</a>
                </div>
            </div>
        </div>
    <?php else: ?>
        <!-- Admin Panel -->
        <nav class="admin-navbar">
            <div class="nav-container">
                <div class="nav-brand">
                    <h1 class="brand-logo">GROW</h1>
                    <span class="admin-badge">Admin Panel</span>
                </div>
                <div class="nav-menu">
                    <a href="index.html" class="nav-link">View Website</a>
                    <a href="?logout=1" class="nav-link logout">Logout</a>
                </div>
            </div>
        </nav>

        <div class="admin-container">
            <div class="admin-header">
                <h1>Update Website Content</h1>
                <p>Manage your website's slider and carousel content</p>
            </div>

            <?php if ($message): ?>
                <div class="message <?php echo strpos($message, 'Error') !== false ? 'error' : 'success'; ?>">
                    <?php echo htmlspecialchars($message); ?>
                </div>
            <?php endif; ?>

            <form method="POST" class="admin-form">
                <!-- Slider Section -->
                <div class="form-section">
                    <h2 class="section-title">Slider Banner</h2>
                    <div class="form-group">
                        <label for="slider_image">Banner Image URL:</label>
                        <input type="url" 
                               id="slider_image" 
                               name="slider_image" 
                               value="<?php echo htmlspecialchars($slider_image); ?>" 
                               placeholder="https://example.com/image.jpg"
                               required>
                        <small class="form-help">Enter the URL of the main banner image</small>
                    </div>
                    
                    <!-- Image Preview -->
                    <div class="image-preview">
                        <img id="slider_preview" 
                             src="<?php echo htmlspecialchars($slider_image); ?>" 
                             alt="Slider Preview"
                             onerror="this.src='https://placehold.co/400x200?text=Image+Preview'">
                    </div>
                </div>

                <!-- Carousel Section -->
                <div class="form-section">
                    <h2 class="section-title">Carousel Items</h2>
                    <div id="carousel-items">
                        <?php foreach ($carousel_items as $index => $item): ?>
                            <div class="carousel-item" data-index="<?php echo $index; ?>">
                                <div class="item-header">
                                    <h3>Item <?php echo $index + 1; ?></h3>
                                    <?php if ($index > 0): ?>
                                        <button type="button" class="remove-item" onclick="removeCarouselItem(<?php echo $index; ?>)">Remove</button>
                                    <?php endif; ?>
                                </div>
                                
                                <div class="form-row">
                                    <div class="form-group">
                                        <label>Image URL:</label>
                                        <input type="url" 
                                               name="carousel_items[<?php echo $index; ?>][image]" 
                                               value="<?php echo htmlspecialchars($item['image']); ?>" 
                                               placeholder="https://example.com/image.jpg"
                                               required>
                                    </div>
                                </div>
                                
                                <div class="form-row">
                                    <div class="form-group">
                                        <label>Title:</label>
                                        <input type="text" 
                                               name="carousel_items[<?php echo $index; ?>][title]" 
                                               value="<?php echo htmlspecialchars($item['title']); ?>" 
                                               placeholder="Service Title"
                                               required>
                                    </div>
                                </div>
                                
                                <div class="form-row">
                                    <div class="form-group">
                                        <label>Description:</label>
                                        <textarea name="carousel_items[<?php echo $index; ?>][description]" 
                                                  placeholder="Service Description"
                                                  required><?php echo htmlspecialchars($item['description']); ?></textarea>
                                    </div>
                                </div>
                                
                                <!-- Item Preview -->
                                <div class="item-preview">
                                    <img src="<?php echo htmlspecialchars($item['image']); ?>" 
                                         alt="<?php echo htmlspecialchars($item['title']); ?>"
                                         onerror="this.src='https://placehold.co/200x150?text=Preview'">
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                    
                    <button type="button" class="add-item-btn" onclick="addCarouselItem()">Add New Item</button>
                </div>

                <!-- Submit Button -->
                <div class="form-actions">
                    <button type="submit" name="update_content" class="update-btn">Update Content</button>
                </div>
            </form>

            <!-- Current Data Display -->
            <div class="current-data">
                <h2>Current Data</h2>
                <div class="data-display">
                    <h3>Last Updated:</h3>
                    <p><?php echo $existing_data['updated_at'] ?? 'Never'; ?></p>
                    
                    <h3>Total Carousel Items:</h3>
                    <p><?php echo count($carousel_items); ?> items</p>
                </div>
            </div>
        </div>
    <?php endif; ?>

    <script src="js/admin.js"></script>
</body>
</html>
