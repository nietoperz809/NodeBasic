#include <stdio.h>
#include <stdlib.h>
#include <memory.h>

#define STOP(x) {puts(x);exit(-1);}

int main(int argc, char* argv[])
{
    if (argc != 3)
        STOP ("1st arg: file name, 2nd arg: needle");
    FILE *fp = fopen (argv[1], "r");
    if (fp == 0)
        STOP ("Can't open ...");

    int n=0, found=0;
    char word[1024];
    while (fscanf(fp, " %1023s", word) == 1)
    {
        n++;
        if (!strcmp (word, argv[2]))
        {
            found++;
            printf ("\'%s\' is at pos. %d\n", argv[2], n);
        }
    }
    printf ("Found \'%s\' %d times.\n", argv[2], found);
}
