import easyocr

def read_receipt(prices,  items):
    reader = easyocr.Reader(['en'])

    result = reader.readtext(prices, allowlist = '.0123456789')
    result2 = reader.readtext(items)

    prices = []


    shoppeditem = []
    i = 0
    for item in range(0, len(result2)):
        if result2[item][1].isalnum() and result2[item][1] == result2[item][1].replace(" ", ""):
            try:
                shoppeditem[i-1][1] = shoppeditem[i-1][1] + result2[item][1]
            except:
                continue
        else:
            shoppeditem.append(result2[item][1])
            i+=1

    shoppedprice = []
    j = 0
    for item in range(0, len(result)):
        if len(result[j][1]) >= 3:
            shoppedprice.append(result[item][1])
        else:
            shoppedprice.append(-1.0)
        
    for i in range(0, len(shoppeditem)):
        if shoppedprice[i] == -1.0:
            prices.append([shoppeditem[i], float(input(f"Error: Please enter the price for <{shoppeditem[i]}>: "))])
        else:
            prices.append([shoppeditem[i], shoppedprice[i]])

    return prices

if __name__ == "__main__":
    prices = read_receipt('./backend/sample/receiptR.png', './backend/sample/receiptL.png')
    print(prices)