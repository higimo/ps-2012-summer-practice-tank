/*
    Модуль для создания карты для игры Tanks.

    Принцип работы: в данной директории размещается файл, который мы хотим преобразовать
                    в функцию. В первой строке считываемого файла должно быть число - ширина wall.
                    С следующей строки начинается матрица, каждый элемент которого числа 0 или 1.
                    0 если в данном квадрате wall отсутствует, и 1 если здесь расположилось wall.
                    Сама функция будет возвращать массив из wall.
                    Название файла, откуда считываются данные должно быть map.txt
                    Программа автоматически создает в данной даректории сгенерированный файл map.js
    Пример считываемого файла:
        map.txt:
                40 //ширина wall
                111
                101
                111
*/ 
#include<iostream.h>
#include<stdio.h>
#include<conio.h>

int getWidth(in)
FILE *in;
{
    char lineWidth[10];
    int width = 0;
    int i = 0;
    char ch;

    ch = getc(in);
    for (i = 0; ch != '\n'; i++)
    {
        width *= 10;
        width += ch - '0';
        ch = getc(in);
    }
    return width;
}

int makeNewWall(out, string, column, width, numWall, j)
FILE *out;

int numWall;
{
    int x = width * j;
    int y = width * column;
    fprintf(out, "    wall[%d][%d] = new Wall();\n", column, j);
    fprintf(out, "    wall[%d][%d].point.x = %d;\n", column, j, x);
    fprintf(out, "    wall[%d][%d].point.y = %d;\n", column, j, y);
    fprintf(out, "    wall[%d][%d].dimension.width = %d;\n", column, j, width);
    fprintf(out, "    wall[%d][%d].dimension.height = %d;\n\n", column, j, width);
    return 0;
}

int makeMap(in, out, width)
FILE *in, *out;
int width;
{
    int string = 0;
    int column = 0;
    char ch;
    int numWall = 0;
    int i = 0;
    int j = 0;

    fprintf(out, "function map()\n");
    fprintf(out, "{\n");
    fprintf(out, "    var wall = new Array(11);\n\n");
    fprintf(out, "    for( var i = 0; i < 11; i++ )\n");
    fprintf(out, "    {\n");
    fprintf(out, "        wall[i] = new Array(15);\n");
    fprintf(out, "    }\n");

    fprintf(out, "for ( var i = 0; i < 11; i++ )\n");
    fprintf(out, "{\n");
    fprintf(out, "    for ( var j = 0; j < 15; j++ )\n");
    fprintf(out, "    {\n");
    fprintf(out, "        wall[i][j] = 0;\n");
    fprintf(out, "    }\n");
    fprintf(out, "}\n");

    ch = getc(in);
    while(ch != EOF)
    {
        for (column = 0; column < 11; column++)
        {
            for(j = 0; j < 15; j++)
            {
                if (ch == '1')
                {
                    makeNewWall(out, string, column, width, numWall, j);
                    numWall++;
                }
                ch = getc(in);
            }
        if (ch == '\n' || ch == EOF)
        {
            ch = getc(in);
        }

        }
        if (ch == '\n' || ch == EOF)
        {
            ch = getc(in);
        }
    }
    fprintf(out, "    return wall;\n");
    fprintf(out, "}\n\n");

    fprintf(out, "function getMapWidth()\n");
    fprintf(out, "{\n");
    fprintf(out, "    return %d;\n", j * width);
    fprintf(out, "}\n\n");
    fprintf(out, "function getMapHeight()\n");
    fprintf(out, "{\n");
    fprintf(out, "    return %d;\n", column * width);
    fprintf(out, "}\n\0");
    return 0;
}

int main()
{
    char *input = "map.txt";
    char *output = "map.js";
    int width = 0;
    FILE *in, *out;
    in = fopen(input, "r");
    out = fopen(output, "w");

    width = getWidth(in);

    makeMap(in, out, width);

    fclose(in);
    fclose(out);
    return 0;
}