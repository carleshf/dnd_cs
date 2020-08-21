function score2mod(score) {
	// Function that converts a score (sum of thee dice throw) to a modifier
	if(score <= 1) {
		return -5
	} else if(2 <= score & score <= 3) {
		return -4
	} else if(4 <= score & score <= 5) {
		return -3
	} else if(6 <= score & score <= 7) {
		return -2
	} else if(8 <= score & score <= 9) {
		return -1
	} else if(10 <= score & score <= 11) {
		return 0
	} else if(12 <= score & score <= 13) {
		return 1
	} else if(14 <= score & score <= 15) {
		return 2
	} else if(16 <= score & score <= 17) {
		return 3
	} else if(18 <= score & score <= 19) {
		return 4
	} else if(20 <= score & score <= 21) {
		return 5
	} else if(22 <= score & score <= 23) {
		return 6
	} else if(24 <= score & score <= 25) {
		return 7
	} else if(26 <= score & score <= 27) {
		return 8
	} else if(28 <= score & score <= 29) {
		return 9
	} else {
		return 10
	}
}

class Character {
	constructor(name, chars, hp, ca) {
		// Constructor for Character class
		//   . name (str): Identifier for the character.
		//   . chars (array): In order, scores for each characteristic.
		//         str, dex, con, int, wis, and cha
		//   . hp (integer): Hit points of the character.
		//   . ca (integer): Armor class of the character.
		// The initiative is taken into account as dex modifier.
		this.name = name
		this.chars = chars
		this.mods = chars.map((x) => score2mod(x))
		this.init = this.mods[1]
		this.hp = hp
		this.ca = ca
		this.acctions = []
	}

	show() {
		console.group()
		console.log(this.name)
		let charnam = ['str', 'dex', 'con', 'int', 'wis', 'cha']
		for(var ii = 0; ii < charnam.length; ii++) {
			console.log(charnam[ii], this.mods[ii], this.chars[ii])
		}
		console.groupEnd()
	}
}




var mage2 = new Character('mage', [11, 12, 13, 11, 16, 15], 12, 11)
mage2.show()


