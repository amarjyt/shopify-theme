$(document).ready(function() {
    function openCartDrawer() {
        $('#cart-drawer').addClass('open');
    }

    function closeCartDrawer() {
        $('#cart-drawer').removeClass('open');
    }

    function updateCart() {
        $.getJSON('/cart.js', function(cart) {
            var cartItemsHtml = '';
            cart.items.forEach(function(item, index) {
                cartItemsHtml += `
                    <div class="cart-drawer__item" data-line="${index + 1}">
                        <img src="${item.image}" alt="${item.product_title}">
                        <div class="cart-drawer__details">
                            <p>${item.product_title}</p>
                            <p>${item.variant_title}</p>
                            <p>${Shopify.formatMoney(item.price)}</p>
                            <input type="number" min="1" class="cart-drawer__quantity" value="${item.quantity}" data-line="${index + 1}">
                            <button class="cart-drawer__remove" data-line="${index + 1}">Remove</button>
                        </div>
                    </div>
                `;
            });
            $('.cart-drawer__items').html(cartItemsHtml);
            $('.cart-drawer__footer p').html(`Total: ${Shopify.formatMoney(cart.total_price)}`);
        });
    }

    $('body').on('click', '.cart-drawer__remove', function() {
        var line = $(this).data('line');
        $.post('/cart/change.js', { line: line, quantity: 0 }, function() {
            updateCart();
        });
    });

    $('body').on('change', '.cart-drawer__quantity', function() {
        var line = $(this).data('line');
        var quantity = $(this).val();
        $.post('/cart/change.js', { line: line, quantity: quantity }, function() {
            updateCart();
        });
    });

    $('body').on('click', '.cart-drawer__close', function() {
        closeCartDrawer();
    });

    $(document).on('click', '.add-to-cart', function(e) {
        e.preventDefault();
        var form = $(this).closest('form');
        $.post('/cart/add.js', form.serialize(), function() {
            updateCart();
            openCartDrawer();
        }, 'json');
    });

    updateCart();
});
