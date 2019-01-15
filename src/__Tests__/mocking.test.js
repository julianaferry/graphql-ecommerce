function Person(name, foods) {
    this.name = name;
    this.foods = foods;
}

Person.prototype.fetchFavFoods = function() {
    return new Promise((res, reject) => {
        //simulate api
        setTimeout(() => resolve(this.foods), 2000);
    });
};

describe('mocking learning',() => {
    it('mocks a reg function',() => {
        const fetchDogs = jest.fn();
        fetchDogs('snickers');
        expect(fetchDogs).toHaveBeenCalled();
        expect(fetchDogs).toBeCalledWith('snickers');
        fetchDogs('hugo');
        expect(fetchDogs).toBeCalledTimes(2);
    });

    it('can create a person', () => {
        const me = new Person('Ju', ['pizza', 'falafel']);
        expect(me.name).toBe('Ju');
    });

    it('can fetch foods', async() => {
        const me = new Person('Ju',  ['pizza', 'falafel']);
        //mock favFoods function
        me.fetchFavFoods = jest.fn().mockResolvedValue(['sushi','ramen']);
        const favFoods = await me.fetchFavFoods();
        console.log(favFoods);
        expect(favFoods).toContain('sushi');
    });
});