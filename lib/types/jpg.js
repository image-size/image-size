/**
 * jpg.js (image-size)
 *
 * Copyright © 2013 MADE GmbH - All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * This file and all it's contents are proprietary and confidential.
 *
 * @file jpg.js
 * @author Manny-MADE
 * @copyright 2013 MADE GmbH. All rights reserved.
 * @section License
 * This file is licensed under the MIT License (MIT).
 * Further information on the file license is available on the internet
 * http://opensource.org/licenses/MIT
 */
 
module.exports = function (buffer) 
{
	var i=0;
	var len = buffer.length;
	
	// NOTE: we only support baseline and progressive JPGs here
	// NOTE: due to the structure of the loader class, we only get a buffer
	// with a maximum size of 4096 bytes. so if the SOF marker is outside
	// if this range we're fucked. 
	
	// ensure JPG magic is here
	if(buffer[i] !== 0xFF || buffer[i+1] !== 0xD8 || buffer[i+2] !== 0xFF && buffer[i+3] !== 0xE0)
		throw new TypeError('Invalid JPG, missing JPG magic word');
	i += 4;
	
	// ensure the "JFIF\0" tag exists
	if(buffer[i+2] !== 0x4A || buffer[i+3] !== 0x46 || buffer[i+4] !== 0x49 || buffer[i+5] !== 0x46 || buffer[i+6] !== 0x00) 
		throw new TypeError('Invalid JPG, missing JFIF-tag');
	
	// read block length of first JPG block
	var currentBlockLength = buffer.readUInt16BE(i);
	
	while(i<len) 
	{
		i += currentBlockLength;
		
		if(i >= len) 
			throw new TypeError('Invalid JPG, trying to read offset='+i+' with a buffer of size=' + len); 
		
		// every JPG marker starts with 0xFF
		if(buffer[i] !== 0xFF)
			throw new TypeError('Invalid JPG, marker table corrupted'); 
		
		// 0xFFC0 is baseline(SOF), 0xFFC2 is progressive(SOF2)
		if(buffer[i+1] === 0xC0 || buffer[i+1] === 0xC2)
		{
			// SOF/SOF2 layout:
			// byte0 = marker 			(size 16)
			// byte2 = block length 	(size 16)
			// byte4 = sample precision	(size 8)
			// byte5 = height 			(size 16)
			// byte7 = width			(size 16)
			return {
				'height' : buffer.readUInt16BE(i+5),
				'width' : buffer.readUInt16BE(i+7)
			};
		}
			
		i+=2;
		currentBlockLength = buffer.readUInt16BE(i);
	}
	
	throw new TypeError('Invalid JPG, no size found'); 
};
