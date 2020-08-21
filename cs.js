String.prototype.trim = function() {
	return String(this).replace(/^\s+|\s+$/g, '')
}

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

function str2dice(str) {
	var pieces = str.split('d')
	if(pieces[0] == '') {
		pieces[0] = 1
	}
	return([pieces.length == 2, pieces[0], pieces[1]])
}

function dice2str(dice) {
	return dice[0] + 'd' + dice[1]
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
		// Prints the definition of a character
		let x = '[CHARACTER] ' + this.name
		console.group()
		console.log(x)
		//console.log('-'.repeat(x.length))
		let charnam = ['str', 'dex', 'con', 'int', 'wis', 'cha']
		for(var ii = 0; ii < charnam.length; ii++) {
			console.log(charnam[ii] + ': ' + this.mods[ii] + ' (' + this.chars[ii] + ')')
		}
		//console.log('-'.repeat(x.length))
		console.groupEnd()
	}
}

class Action {
	constructor(type, target, tar_con, hab_dic, hab_mod, hab_dc, dam_dic, dam_mod) {
		// Construction for Action class
		//    . type (str): Defines the type of action.
		//        attack, heal
		//    . target (array): Indicated the target of the action.
		//        enemy, own, ally
		//    . tar_con (str): If not empty, indicated a condition to
		//      define the target when "enemy" or "ally" is provided. By 
		//      default is set to "closest".
		//        farthest, closest, lowestAC, lowestHP
		//    . hab_dic (str): Defines the ability dice to roll. If empty it 
		//      assumes that no ability throw is required.
		//    . hab_mod (int): Modifier to be added or subtracted to the 
		//      ability throw.
		//    . hab_dc (int): Difficultly class required to overcome (>=) in 
		//      order to be able to perform this action.
		//    . dam_dic (str): Defined the damage dice (for attach), and damage
		//      healing. Follows the format (num)d(sides).
		//    . dam_mod (int): Modifier to be added or subtracted to the
		//      damage, or healing, throw.
		this.valid = true
		
		type = type.toLowerCase().trim()
		target = target.toLowerCase().trim()
		tar_con = tar_con.toLowerCase().trim()
		hab_dic = hab_dic.toLowerCase().trim()
		dam_dic = dam_dic.toLowerCase().trim()
		
		if(type != 'attack' & type != 'heal') {
			this.valid = false
			console.error('Created action of type "' + type + '". Action type must take "attack" or "heal".')
		}
		this.type = type

		if(target != 'enemy' & target != 'own' & target != 'ally') {
			this.valid = false
			console.error('Created action of target "' + target + '". Action target must take "enemy", "own", or "ally".')
		}
		this.target = target

		if(tar_con != '' & tar_con != 'farthest' & tar_con != 'closest' & tar_con != 'lowestac' & tar_con != 'lowesthp') {
			this.valid = false
			console.error('Created action of tar_con "' + tar_con + '". Action tar_con must take "farthest", "closest", "lowestAC", or "lowestHP".')
		}
		this.tar_con = tar_con

        if(hab_dic != '') {
			hab_dic = str2dice(hab_dic)
			if(!hab_dic[0]) {
				this.valid = false
				console.error('Created action with an incorrect hab_dic.')
			}
			this.hab_dic = [hab_dic[1], hab_dic[2]]
		} else {
			this.hab_dic = ''
		}

		dam_dic = str2dice(dam_dic)
		if(!dam_dic[0]) {
			this.valid = false
			console.error('Created action with an incorrect dam_dic.')
		}
		this.dam_dic = [dam_dic[1], dam_dic[2]]

		if(hab_mod == '') {
			this.hab_mod = 0
		} else {
			this.hab_mod = parseInt(hab_mod)
		}

		if(hab_dc == '' & this.hab_dic != '') {
			this.valid = false
			console.error('Created action that requires an ability throw (' + dice2str(this.hab_dic) + ') but not hab_dc was provided.')
		} else {
			this.hab_dc = parseInt(hab_dc)
		}

		if(dam_mod == '') {
			this.dam_mod = 0
		} else {
			this.dam_mod = parseInt(dam_mod)
		}
	}

	show() {
		// Prints the definition of an action
		var str = this.type + ' to '
		if(this.tar_con != '') {
			str = str + this.tar_con + ' '
		} else {
			str = str + 'random '
		}
		str = str + this.target + ' '
		if(this.hab_dic != '') {
			str = str + 'with ability throw of a ' + dice2str(this.hab_dic)
			if(this.hab_mod > 0) {
				str = str + ' +' + this.hab_mod
			} else if(this.hab_mod < 0) {
				str = str + ' ' + this.hab_mod
			}
			str = str + ' with a DC of ' + this.hab_dc + ' '
		}
		if(this.type == 'attack') {
			str = str + 'to damage ' + dice2str(this.dam_dic)
		} else {
			str = str + 'to restore ' + dice2str(this.dam_dic)
		}
		if(this.dam_mod > 0) {
			str = str + ' +' + this.dam_mod
		} else if(this.dam_mod < 0) {
			str = str + ' ' + this.dam_mod
		}

		str = str + ' points'

		console.group()
		console.log('[ACTION]')
		console.log(str)
		console.groupEnd()
	}
}



var mage2 = new Character('mage', [11, 12, 13, 11, 16, 15], 12, 11)
mage2.show()

var ac1 = new Action('heal', 'enemy', '', '', 1, 10, '1d4', 2)
ac1.show()
