
def checkName(name):
    checkNam = input("Is your name " + name + "? ")

    if checkNam.lower() == "yes":
        print("Hello,", name)
    else:
        print("We're sorry about that.")

checkName("Keenan")
