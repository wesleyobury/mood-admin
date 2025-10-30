#!/usr/bin/env python3
import os
import re

# List of files to update (excluding index.tsx and auth)
files_to_update = [
    '/app/frontend/app/abs-equipment.tsx',
    '/app/frontend/app/abs-workout-display.tsx',
    '/app/frontend/app/adjustable-bench-workout-display.tsx',
    '/app/frontend/app/back-equipment.tsx',
    '/app/frontend/app/back-workout-display.tsx',
    '/app/frontend/app/biceps-equipment.tsx',
    '/app/frontend/app/biceps-workout-display.tsx',
    '/app/frontend/app/bodyweight-equipment.tsx',
    '/app/frontend/app/bodyweight-explosiveness-workouts.tsx',
    '/app/frontend/app/calisthenics-equipment.tsx',
    '/app/frontend/app/calisthenics-workouts.tsx',
    '/app/frontend/app/cardio-equipment.tsx',
    '/app/frontend/app/cart.tsx',
    '/app/frontend/app/chest-equipment.tsx',
    '/app/frontend/app/chest-workout-display.tsx',
    '/app/frontend/app/compound-equipment.tsx',
    '/app/frontend/app/compound-workout-display.tsx',
    '/app/frontend/app/decline-bench-workout-display.tsx',
    '/app/frontend/app/explosiveness-type.tsx',
    '/app/frontend/app/flat-bench-workout-display.tsx',
    '/app/frontend/app/incline-bench-workout-display.tsx',
    '/app/frontend/app/lazy-bodyweight-equipment.tsx',
    '/app/frontend/app/lazy-bodyweight-workouts.tsx',
    '/app/frontend/app/lazy-full-body-workouts.tsx',
    '/app/frontend/app/lazy-lower-body-workouts.tsx',
    '/app/frontend/app/lazy-training-type.tsx',
    '/app/frontend/app/lazy-upper-body-workouts.tsx',
    '/app/frontend/app/lazy-weight-selection.tsx',
    '/app/frontend/app/legs-equipment.tsx',
    '/app/frontend/app/legs-muscle-groups.tsx',
    '/app/frontend/app/legs-workout-display.tsx',
    '/app/frontend/app/light-weights-equipment.tsx',
    '/app/frontend/app/light-weights-workouts.tsx',
    '/app/frontend/app/outdoor-equipment.tsx',
    '/app/frontend/app/outdoor-workouts.tsx',
    '/app/frontend/app/shoulders-equipment.tsx',
    '/app/frontend/app/shoulders-workout-display.tsx',
    '/app/frontend/app/triceps-equipment.tsx',
    '/app/frontend/app/triceps-workout-display.tsx',
    '/app/frontend/app/weight-based-workouts.tsx',
    '/app/frontend/app/weight-equipment.tsx',
    '/app/frontend/app/workout-display.tsx',
    '/app/frontend/app/workout-guidance.tsx',
    '/app/frontend/app/workout-session.tsx',
    '/app/frontend/app/workout-type.tsx',
]

def update_file(filepath):
    """Update a single file to add HomeButton import and replace headerSpacer"""
    try:
        with open(filepath, 'r') as f:
            content = f.read()
        
        # Skip if already has HomeButton
        if 'HomeButton' in content:
            print(f"✓ Skipped {os.path.basename(filepath)} - already has HomeButton")
            return False
        
        # Skip if no header structure found
        if 'headerSpacer' not in content and 'clearButton' not in content:
            print(f"⚠ Skipped {os.path.basename(filepath)} - no standard header found")
            return False
        
        original_content = content
        
        # Add import after useSafeAreaInsets import
        import_pattern = r"(import \{ useSafeAreaInsets \} from 'react-native-safe-area-context';)"
        import_replacement = r"\1\nimport HomeButton from '../components/HomeButton';"
        content = re.sub(import_pattern, import_replacement, content)
        
        # Replace headerSpacer with HomeButton
        content = re.sub(
            r'<View style={styles\.headerSpacer} />',
            '<HomeButton />',
            content
        )
        
        # For cart.tsx - add home button after clear button condition
        if 'cart.tsx' in filepath and 'clearButton' in content:
            # Replace the clearButton section to add home button
            cart_pattern = r'({cartItems\.length > 0 && \(\s+<TouchableOpacity[^}]+</TouchableOpacity>\s+\)\s+)}\s+</View>'
            cart_replacement = r'\1}\n        <HomeButton />\n      </View>'
            content = re.sub(cart_pattern, cart_replacement, content, flags=re.DOTALL)
        
        if content != original_content:
            with open(filepath, 'w') as f:
                f.write(content)
            print(f"✓ Updated {os.path.basename(filepath)}")
            return True
        else:
            print(f"⚠ No changes needed for {os.path.basename(filepath)}")
            return False
            
    except Exception as e:
        print(f"✗ Error updating {os.path.basename(filepath)}: {e}")
        return False

def main():
    updated_count = 0
    for filepath in files_to_update:
        if os.path.exists(filepath):
            if update_file(filepath):
                updated_count += 1
        else:
            print(f"✗ File not found: {filepath}")
    
    print(f"\n{'='*50}")
    print(f"Total files updated: {updated_count}/{len(files_to_update)}")

if __name__ == '__main__':
    main()
