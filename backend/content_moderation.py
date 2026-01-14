"""
Content Moderation Module
Handles content filtering, user reporting, and blocking functionality
"""

import re
from typing import List, Optional, Set
from datetime import datetime, timezone

# Profanity/Objectionable content word list
# This is a basic list - can be extended as needed
BLOCKED_WORDS = {
    # Slurs and hate speech (various categories)
    'nigger', 'nigga', 'faggot', 'fag', 'retard', 'retarded', 'spic', 'chink', 
    'kike', 'wetback', 'beaner', 'gook', 'coon', 'dyke', 'tranny',
    
    # Extreme profanity
    'fuck', 'fucking', 'fucked', 'fucker', 'motherfucker', 'motherfucking',
    'shit', 'shitting', 'bullshit', 'horseshit', 'shitty',
    'cunt', 'cock', 'dick', 'pussy', 'asshole', 'ass', 'bitch', 'bitches',
    'whore', 'slut', 'bastard', 'damn', 'goddamn',
    
    # Sexual content
    'porn', 'pornography', 'xxx', 'nude', 'nudes', 'naked', 'sex', 'sexual',
    'penis', 'vagina', 'boobs', 'tits', 'dildo', 'masturbate', 'orgasm',
    
    # Violence related
    'kill', 'murder', 'rape', 'suicide', 'terrorist', 'bomb', 'shoot',
    
    # Drug references
    'cocaine', 'heroin', 'meth', 'crack',
}

# Words that are okay in fitness context but flagged elsewhere
FITNESS_CONTEXT_WORDS = {
    'ass',  # as in "kick ass workout"
    'burn',  # as in "feel the burn"
    'killer',  # as in "killer workout"
    'beast',  # as in "beast mode"
    'crush',  # as in "crush your goals"
}

# Report categories
REPORT_CATEGORIES = [
    "spam",
    "harassment_bullying", 
    "hate_speech",
    "nudity_sexual_content",
    "violence",
    "misinformation",
    "other"
]

# Report status types
REPORT_STATUS = {
    "pending": "pending",
    "reviewed": "reviewed",
    "action_taken": "action_taken",
    "dismissed": "dismissed"
}

def normalize_text(text: str) -> str:
    """Normalize text for comparison - handle common obfuscation attempts"""
    if not text:
        return ""
    
    # Convert to lowercase
    text = text.lower()
    
    # Common letter substitutions used to bypass filters
    substitutions = {
        '0': 'o',
        '1': 'i',
        '3': 'e',
        '4': 'a',
        '5': 's',
        '7': 't',
        '8': 'b',
        '@': 'a',
        '$': 's',
        '!': 'i',
        '*': '',
        '_': '',
        '-': '',
        '.': '',
    }
    
    for old, new in substitutions.items():
        text = text.replace(old, new)
    
    # Remove repeated characters (e.g., "fuuuuck" -> "fuck")
    text = re.sub(r'(.)\1{2,}', r'\1', text)
    
    return text

def check_content(text: str, strict: bool = True) -> dict:
    """
    Check content for objectionable material
    
    Returns:
        dict with:
        - is_clean: bool - True if content passes filter
        - flagged_words: list - Words that triggered the filter
        - confidence: str - 'high', 'medium', 'low'
    """
    if not text:
        return {"is_clean": True, "flagged_words": [], "confidence": "high"}
    
    normalized = normalize_text(text)
    words = set(re.findall(r'\b\w+\b', normalized))
    
    flagged = []
    
    for word in words:
        if word in BLOCKED_WORDS:
            # Check if it's a fitness context word that might be acceptable
            if word in FITNESS_CONTEXT_WORDS and not strict:
                continue
            flagged.append(word)
    
    # Also check for partial matches (e.g., "f*ck" variations)
    for blocked in BLOCKED_WORDS:
        if len(blocked) >= 4:  # Only check longer words for partials
            pattern = re.compile(r'\b' + ''.join([f'{c}+' for c in blocked]) + r'\b')
            if pattern.search(normalized) and blocked not in flagged:
                flagged.append(blocked)
    
    is_clean = len(flagged) == 0
    
    # Determine confidence
    if len(flagged) == 0:
        confidence = "high"
    elif len(flagged) == 1 and flagged[0] in FITNESS_CONTEXT_WORDS:
        confidence = "low"
    elif len(flagged) >= 3:
        confidence = "high"
    else:
        confidence = "medium"
    
    return {
        "is_clean": is_clean,
        "flagged_words": flagged,
        "confidence": confidence
    }

def filter_content(text: str) -> tuple[str, bool]:
    """
    Filter and optionally censor content
    
    Returns:
        tuple of (filtered_text, was_modified)
    """
    if not text:
        return text, False
    
    result = check_content(text)
    
    if result["is_clean"]:
        return text, False
    
    # Censor flagged words
    filtered = text
    for word in result["flagged_words"]:
        # Case-insensitive replacement with asterisks
        pattern = re.compile(re.escape(word), re.IGNORECASE)
        censored = word[0] + '*' * (len(word) - 1) if len(word) > 1 else '*'
        filtered = pattern.sub(censored, filtered)
    
    return filtered, True

def is_valid_report_category(category: str) -> bool:
    """Check if report category is valid"""
    return category in REPORT_CATEGORIES

def get_report_categories() -> List[str]:
    """Get list of valid report categories"""
    return REPORT_CATEGORIES.copy()
