"""
Content Moderation Module
Handles content filtering, user reporting, and blocking functionality
"""

import re
import logging
from typing import List, Optional, Tuple
from datetime import datetime, timezone

# Set up logging for moderation
moderation_logger = logging.getLogger('content_moderation')
moderation_logger.setLevel(logging.INFO)

# Comprehensive banned keyword list for content filtering
# Categories: Harassment, Hate Speech, Sexual Content, Violence, Drugs

# === HATE SPEECH & SLURS ===
HATE_SPEECH_WORDS = {
    'nigger', 'nigga', 'faggot', 'fag', 'retard', 'retarded', 'spic', 'chink',
    'kike', 'wetback', 'beaner', 'gook', 'coon', 'dyke', 'tranny', 'shemale',
    'towelhead', 'raghead', 'jap', 'cracker', 'honky', 'gringo', 'paki',
    'negro', 'darkie', 'slope', 'zipperhead', 'halfbreed', 'mongrel',
}

# === HARASSMENT & BULLYING ===
HARASSMENT_WORDS = {
    'kys', 'kill yourself', 'go die', 'neck yourself', 'drink bleach',
    'hope you die', 'worthless', 'pathetic loser', 'ugly bitch',
    'fat pig', 'fat ass', 'whale', 'landwhale', 'fatso',
}

# === SEXUAL & PORNOGRAPHIC CONTENT ===
SEXUAL_CONTENT_WORDS = {
    # Pornographic terms
    'porn', 'porno', 'pornography', 'xxx', 'xxxx', 'hardcore',
    'hentai', 'milf', 'gilf', 'dilf', 'pawg', 'bbc', 'bwc',
    'gangbang', 'gang bang', 'bukkake', 'creampie', 'cumshot',
    'blowjob', 'blow job', 'handjob', 'hand job', 'footjob',
    'deepthroat', 'deep throat', 'facial', 'anal', 'analsex',
    'threesome', 'foursome', 'orgy', 'swingers', 'dogging',
    'cuckold', 'hotwife', 'slutwife', 'onlyfans', 'fansly',
    
    # Nudity and body parts (explicit context)
    'nude', 'nudes', 'naked', 'nudity', 'topless', 'bottomless',
    'penis', 'cock', 'dick', 'schlong', 'dong', 'boner', 'erection',
    'vagina', 'pussy', 'cunt', 'twat', 'cooch', 'cooter', 'snatch',
    'boobs', 'tits', 'titties', 'breasts', 'nipples', 'areola',
    'ass', 'asshole', 'anus', 'butthole', 'butt plug',
    'balls', 'testicles', 'scrotum', 'nutsack',
    'clitoris', 'clit', 'labia', 'vulva',
    
    # Sexual acts
    'sex', 'sexual', 'sexting', 'sext',
    'fuck', 'fucking', 'fucked', 'fucker', 'fucks',
    'masturbate', 'masturbation', 'jerk off', 'jack off', 'wank',
    'orgasm', 'cum', 'cumming', 'ejaculate', 'ejaculation',
    'dildo', 'vibrator', 'fleshlight', 'sex toy', 'sextoy',
    'horny', 'aroused', 'turned on', 'getting off',
    'rape', 'raping', 'rapist', 'molest', 'molestation',
    'incest', 'pedophile', 'pedo', 'child porn', 'cp',
    'bdsm', 'bondage', 'domination', 'submission', 'sadism',
    
    # Prostitution
    'prostitute', 'hooker', 'escort', 'call girl', 'whore', 'slut',
    'hoe', 'thot', 'skank', 'tramp', 'streetwalker',
}

# === VIOLENCE & THREATS ===
VIOLENCE_WORDS = {
    'kill', 'murder', 'assassinate', 'execute', 'slaughter',
    'shoot', 'stab', 'strangle', 'choke', 'suffocate',
    'bomb', 'bombing', 'terrorist', 'terrorism', 'jihad',
    'massacre', 'genocide', 'holocaust',
    'torture', 'mutilate', 'dismember', 'decapitate', 'behead',
}

# === DRUG REFERENCES ===
DRUG_WORDS = {
    'cocaine', 'coke', 'crack', 'heroin', 'meth', 'methamphetamine',
    'fentanyl', 'opioid', 'mdma', 'ecstasy', 'molly',
    'lsd', 'acid', 'shrooms', 'psilocybin', 'dmt',
    'ketamine', 'pcp', 'angel dust', 'bath salts',
}

# === PROFANITY (General) ===
PROFANITY_WORDS = {
    'shit', 'shitting', 'bullshit', 'horseshit', 'shitty', 'shithead',
    'bitch', 'bitches', 'bitchy', 'son of a bitch',
    'bastard', 'damn', 'goddamn', 'damnit',
    'motherfucker', 'motherfucking', 'mofo',
    'piss', 'pissed', 'pissing',
}

# Combine all blocked words
BLOCKED_WORDS = (
    HATE_SPEECH_WORDS | 
    HARASSMENT_WORDS | 
    SEXUAL_CONTENT_WORDS | 
    VIOLENCE_WORDS | 
    DRUG_WORDS | 
    PROFANITY_WORDS
)

# Multi-word phrases that should be blocked
BLOCKED_PHRASES = [
    'kill yourself', 'go die', 'neck yourself', 'drink bleach',
    'hope you die', 'gang bang', 'blow job', 'hand job',
    'deep throat', 'child porn', 'sex toy', 'jerk off',
    'jack off', 'turned on', 'getting off', 'call girl',
    'son of a bitch', 'bath salts', 'angel dust',
]

# Words that are okay in fitness context but flagged elsewhere
FITNESS_CONTEXT_WORDS = {
    'burn',  # as in "feel the burn"
    'killer',  # as in "killer workout"
    'beast',  # as in "beast mode"
    'crush',  # as in "crush your goals"
    'destroy',  # as in "destroy that workout"
    'smash',  # as in "smash your goals"
}

# Report categories
REPORT_CATEGORIES = [
    "spam",
    "harassment_bullying", 
    "hate_speech",
    "nudity_sexual_content",
    "violence",
    "misinformation",
    "scam_fraud",
    "self_harm",
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
