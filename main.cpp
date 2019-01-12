#include <iostream>
using namespace std;

const char* Names[] = {"Daria", "Lea", "Lilly"};
typedef enum tagHairClr {BROWN, BLONDE} HairClr;

#define FAVORITE_GIRL(hair,size) ({"Daria", "Lea", "Lilly"}[(size>=170)||hair?size>=170:2])

#define test {"Daria", "Lea", "Lilly"}[0]

const char* Get_Name(HairClr hair_color, unsigned int size)
{
    switch(hair_color)
    {
        case BROWN: return Names[2];
        case BLONDE:
            if(size<170) return Names[1];
            else return Names[0];
        default:
            return NULL;
    }
}

int main()
{
    const char *hc = Get_Name(BROWN, 120);
    int lala;
    lal = {1,2,4}[0];
    cout << lal;
}
