const { promises: fs } = require('fs')

class Container {

    constructor(route) {
        this.route = route;
    }

    async list(id) {
        const objs = await this.listAll();
        const wanted = objs.find(o => o.id == id);
        return wanted;
    }

    async listAll() {
        try {
            const objs = await fs.readFile(this.route, 'utf-8');
            return JSON.parse(objs);
        } catch (err) {
            return [];
        }
    }

    async save(obj) {
        const objs = await this.listAll()
        const newID = objs.length === 0 ? 1 : parseInt(objs[objs.length - 1].id) + 1;
        const newObj = { ...obj, id: newID };
        objs.push(newObj);
        try {
            await fs.writeFile(this.route, JSON.stringify(objs, null, 2));
            return newID;
        } catch (err) {
            throw new Error(`Error al guardar: ${err}`);
        }
    }

    async update(elem, id) {
        const objs = await this.listAll();
        const index = objs.findIndex(o => o.id == id);
        if (index == -1) {
            throw new Error(`Error al actualizar: no se encontró el id ${id}`);
        } else {
            objs[index] = { ...elem, id }
            try {
                await fs.writeFile(this.route, JSON.stringify(objs, null, 2));
            } catch (err) {
                throw new Error(`Error al borrar: ${err}`);
            }
        }
    }

    async delete(id) {
        const objs = await this.listAll();
        const index = objs.findIndex(o => o.id == id);
        if (index == -1) {
            throw new Error(`Error al borrar: no se encontró el id ${id}`);
        }

        objs.splice(index, 1)
        try {
            await fs.writeFile(this.route, JSON.stringify(objs, null, 2));
        } catch (err) {
            throw new Error(`Error al borrar: ${err}`);
        }
    }

    async deleteAll() {
        try {
            await fs.writeFile(this.route, JSON.stringify([], null, 2));
        } catch (err) {
            throw new Error(`Error al borrar todo: ${err}`);
        }
    }
}

module.exports = Container