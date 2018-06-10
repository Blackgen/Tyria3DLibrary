/*
Copyright © Tyria3DLibrary project contributors

This file is part of the Tyria 3D Library.

Tyria 3D Library is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Tyria 3D Library is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with the Tyria 3D Library. If not, see <http://www.gnu.org/licenses/>.
*/

const DataRenderer = require('./DataRenderer');

class HexaRenderer extends DataRenderer {
    constructor() {
        super();
    }

    renderAsync(callback) {
        const fileId = this.localReader.getFileIndex(this.settings.id);
        this.localReader.readFile(fileId, true).then((inflatedData, dxtType, imageWidth, imageHeight) => {
            //Exports the id and the raw data
            this.getOutput().fileId = this.settings.id;
            this.getOutput().rawData = inflatedData;

            // Create image using returned data.
            this.getOutput().image = {
                data: new Uint8Array(inflatedData),
                width: imageWidth,
                height: imageHeight
            };

            callback();
        })

    }
}